const { instantsearch } = window;
import { searchClient, insightsMiddleware, searchConfig, pubsub } from "./algoliaConfig";
import { getQueryParam, QUERY_UPDATE_EVT } from './common';
const { connectSearchBox } = instantsearch.connectors;

// Main flag
const store = {
  hasResults: true
};

// Read the query attribute if any
const initialQuery = getQueryParam();
const initialUiState = {};
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
const myInstantSearchGlobalConfig = instantsearch.widgets.configure({
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



// Template for rendering results
const myHitsCustomTemplate = instantsearch.widgets.hits({
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

const myPaginator = instantsearch.widgets.pagination({
  container: '#pagination',
})

// Index for non-results pages rendering
const nonResultsIndex = instantsearch.widgets.index({
  indexName: searchConfig.noResultsIndex,
  indexId: searchConfig.noResultsIndex,
}).addWidgets([
  instantsearch.widgets.configure({
    query: '',
    ruleContexts: searchConfig.instantSearchTags.nonResults,
    analyticsTags: searchConfig.instantSearchTags.nonResults,
  }),
  instantsearch.widgets.hits({
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
