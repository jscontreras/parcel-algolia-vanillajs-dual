import instantsearch from 'instantsearch.js';
import { hits, index, configure, pagination } from 'instantsearch.js/es/widgets';
import { getQueryParam, QUERY_UPDATE_EVT } from './common.js';
import { connectSearchBox } from 'instantsearch.js/es/connectors';
import { searchClient, insightsMiddleware, searchConfig, pubsub } from "./algoliaConfig.js";
import "instantsearch.css/themes/satellite-min.css"

// Main flag
const store = {
  hasResults: true
};

// Read the query attribute if any
const initialQuery = getQueryParam();
const initialUiState = {};
initialUiState[searchConfig.noResultsIndex] = { query: '' };

// Update InitialUIState if there is a query in the url
if (initialQuery !== "") {
  initialUiState[searchConfig.recordsIndex] = {
    query: initialQuery,
  };
} else {
  initialUiState[searchConfig.recordsIndex] = {}
}

// Create instantSearch instance using instant_search index and client
const myInstantSearch = instantsearch({
  indexName: searchConfig.recordsIndex,
  searchClient,
  initialUiState
});

/**
 * INSTANT SEARCH WIDGETS
 */

// Instant Search Global Configuration Widget
const myInstantSearchGlobalConfig = configure({
  hitsPerPage: 24,
  ruleContexts: searchConfig.instantSearchTags.recordsSearch,
  analyticsTags: searchConfig.instantSearchTags.recordsSearch,
});

// Add custom SearchBox render that listens to Autocomplete but doesn't render anything
const renderSearchBox = ({ refine, instantSearchInstance }, isFirstRender) => {
  // Rendering logic for listening from Autocomplete events.
  if (isFirstRender) {
    pubsub.subscribe(QUERY_UPDATE_EVT, (data, _msg) => {
      if (data.index === instantSearchInstance.indexName) {
        refine(data.query);
      }
    });
  }
  return '';
}

// Connect custom searchbox render with connectSearchBox
const customSearchBox = connectSearchBox(
  renderSearchBox
);

// Instanciate your custom searchBox widget
const customSearchBoxWidget = customSearchBox({
  container: '#searchbox__container',
});

/**
 * Rendering Hit function
 * @param {} hit
 * @param {*} param1
 * @returns
 */
function itemTemplate(hit, { html, components, sendEvent }) {
  return html`<article class="pb-8">
      <a href="#" onClick="${evt => {
      evt.preventDefault();
      sendEvent('click', hit, 'Result Clicked');
      window.location.href = hit.url;
    }}" class="text-blue-400">
        ${components.Highlight({ attribute: 'name', hit })}
      </a>
      <img src="${hit.image}"/>
      <p>${components.Snippet({ attribute: 'description', hit })}</p>
      <button class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded absolute bottom-5" onClick="${evt => {
      evt.preventDefault();
      sendEvent('conversion', hit, 'Product Added to Cart');
    }}">
        Add to Cart +
      </button>
    </article>`
}

// Virtual search box for non-results index
const virtualSearchBox = connectSearchBox(() => null);

// Template for rendering results
const myHitsCustomTemplate = hits({
  container: '#hits-default__container',
  transformItems(hits) {
    store.hasResults = hits.length > 0;
    return hits;
  },
  templates: {
    item: itemTemplate,
    empty(results, { html }) {
      return html`<div class="no-results-copy">No results for <q>${results.query}</q>, but take a look at our best Sellers!!</div>`;
    },
  }
});

const myPaginator = pagination({
  container: '#pagination',
})

// Index for non-results pages rendering
const nonResultsIndex = index({
  indexName: searchConfig.noResultsIndex,
  indexId: `${searchConfig.noResultsIndex}--noREsults}`,
}).addWidgets([
  configure({
    query: '',
    ruleContexts: searchConfig.instantSearchTags.nonResults,
    analyticsTags: searchConfig.instantSearchTags.nonResults,
  }),
  virtualSearchBox({}),
  hits({
    container: '#hits-non-results__container',
    templates: {
      item: itemTemplate
    },
    transformItems(items) {
      if (store.hasResults) {
        return [];
      }
      return items;
    }
  })]
);


// Array for InstantSearch widgets
const widgets = [
  myInstantSearchGlobalConfig,
  customSearchBoxWidget,
  myHitsCustomTemplate,
  myPaginator,
  nonResultsIndex
]

// Adding the widgets to the InstantSearch instance
myInstantSearch.addWidgets(widgets);

myInstantSearch.use(insightsMiddleware);

// Initialize InstantSearch
myInstantSearch.start();
