import instantsearch from 'instantsearch.js';
import { hits, index, configure, pagination, sortBy, currentRefinements, panel } from 'instantsearch.js/es/widgets';
import { getQueryParam, QUERY_UPDATE_EVT } from './common.js';
import { connectSearchBox } from 'instantsearch.js/es/connectors';
import { searchClient, insightsMiddleware, searchConfig, pubsub } from "./algoliaConfig.js";
import "instantsearch.css/themes/satellite-min.css"
import { dynamicFacetsWidget } from './instantSearchFacets.js';

dynamicFacetsWidget
// Main flag
const store = {
  hasResults: true,
  activeFacets: 0
};

/**
 * Refreshes the filters button to reflect refinemnts.
 */
function refreshFiltersText() {
  console.log('store.activeFacets', store.activeFacets)
  document.querySelector('.filters-trigger__btn').innerHTML = store.activeFacets ? `Filters(${store.activeFacets})` : `+ Filters`;
  if (store.activeFacets === 0) {
    document.querySelector('#current-refinements').classList.add('current-refinements--hidden');
  } else {
    document.querySelector('#current-refinements').classList.remove('current-refinements--hidden');
  }
}

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

// Sort By Widget
const sortByWidget = sortBy({
  container: '#sort-by__container',
  items: [
    { label: 'Featured', value: 'instant_search' },
    { label: 'Price (asc)', value: 'instant_search_price_asc' },
    { label: 'Price (desc)', value: 'instant_search_price_desc' },
  ],
})

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
      <div className="ais-image__container">
            <img src="${hit.image}"/>
      </div>
      <p>${hit.price}</p>
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
  indexId: `${searchConfig.noResultsIndex}--nonResults}`,
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

/**
 * Current refinements Widget
 */
const refinementsWidget = panel({
  container: '#current-refinements',
  templates: {
    header(options, { html }) {
      if (options.items.length) {
        return html`<h3>Current Refinements:</h3>`;
      }
    },
  }
})(currentRefinements)({
  container: '#current-refinements',
  transformItems: (items) => {
    let refinementsCount = 0;
    let updateRefinments = false;
    // get search index refinments if any
    items.forEach(item => {
      if (item.indexId === searchConfig.recordsIndex) {
        refinementsCount++;
        updateRefinments = true;
        if (item.label.includes('hierarchicalCategories.')) {
          item.label = 'Category';
        }
      }
    })
    if (updateRefinments) {
      store.activeFacets = refinementsCount;
      refreshFiltersText();
    }
    return items
  }
});


// Array for InstantSearch widgets
const widgets = [
  myInstantSearchGlobalConfig,
  customSearchBoxWidget,
  myHitsCustomTemplate,
  myPaginator,
  nonResultsIndex,
  dynamicFacetsWidget,
  sortByWidget,
  refinementsWidget
]

// Adding the widgets to the InstantSearch instance
myInstantSearch.addWidgets(widgets);

myInstantSearch.use(insightsMiddleware);

// Initialize InstantSearch
myInstantSearch.start();


// Add filters button listener
refreshFiltersText();
document.querySelector('.filters-trigger__btn').addEventListener('click',  () => {
  document.querySelector('.ais__main-container').classList.toggle('ais__main-container--facets-mode');
});

// Add close button listener
document.querySelector('.filters-close__btn').addEventListener('click', () => {
  document.querySelector('.ais__main-container').classList.toggle('ais__main-container--facets-mode');
});

// Window resize listener
window.addEventListener('resize', function () {
  if (window.innerWidth < 681) {
    // replace '.my-selector' with your CSS selector
    var element = document.querySelector('.ais__main-container');
    if (element) {
      // replace 'my-class' with your class name
      element.classList.remove('ais__main-container--facets-mode');
    }
  }
});

