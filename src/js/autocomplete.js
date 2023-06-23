const { autocomplete, getAlgoliaResults } = window['@algolia/autocomplete-js'];
const { createLocalStorageRecentSearchesPlugin } = window['@algolia/autocomplete-plugin-recent-searches'];
const { createAlgoliaInsightsPlugin } = window['@algolia/autocomplete-plugin-algolia-insights'];
const { createQuerySuggestionsPlugin } = window['@algolia/autocomplete-plugin-query-suggestions'];
const { createRedirectUrlPlugin } = window['@algolia/autocomplete-plugin-redirect-url'];

// Get Algolia configured clients
import { searchClient, insightsClient, searchConfig, pubsub } from "./algoliaConfig";
// Helper functions
import { printFriendlyDollarCents, getCollection, updateUrlParameter, QUERY_UPDATE_EVT } from "./common";

// Events Plugin
const algoliaInsightsPlugin = createAlgoliaInsightsPlugin({ insightsClient });

// Recent Search Plugin
const recentSearchesPlugin = createLocalStorageRecentSearchesPlugin({
  key: 'navbar',
  limit: 3,
  transformSource({ source }) {
    return {
      ...source,
      onSelect({ state }) {
        autocompleteSubmitHandler(state);
      },
    };
  },
});

// Initializing Redirect Plugin
function transformResponse(results) {
  if (results.query !== "" && results.renderingContent && results.renderingContent.redirect) {
    window.location.href = results.renderingContent.redirect.url;
  }
}

// Redirect via rules Plugin
const redirectUrlPlugin = createRedirectUrlPlugin({
  transformResponse,
});

// Query Suggestion Plugin
const querySuggestionsPlugin = createQuerySuggestionsPlugin({
  searchClient,
  indexName: searchConfig.suggestionsIndex,
  limit: 6,
  transformSource({ source }) {
    return {
      ...source,
      onSelect({ state }) {
        autocompleteSubmitHandler(state);
      },
    };
  },
});

// Results html template
export function itemTemplate(itemTemplateParams) {
  const { item, components, html, state } = itemTemplateParams;
  const handleItemNavigation = (evt) => {
    evt.preventDefault();
    console.log('Implementing this later!!');
  }

  return html`
    <div class="aa-ItemWrapper">
    <div class="aa-ItemContent" onClick="${handleItemNavigation}">
      <div class="aa-ItemContentImage">
        <img
          src="${item.image}"
          alt="${item.name}"
        />
      </div>
      <div class="aa-ItemContentBody">
        <div class="aa-ItemContentDescription">
          ${item.product_type}
        </div>
        <div class="aa-ProductItemContentFooter">
          <div class="aa-ItemContentTitle">
            ${components.Highlight({
    hit: item,
    attribute: 'title',
  })}
          </div>
          <div class="aa-ItemContentDescription">
            ${`$${printFriendlyDollarCents(item.price)}`}
          </div>
        </div>
      </div>
    </div>
  </div>`
}

// No results template
export function noResultsTemplate({ state, html, components }) {
  const { context } = state;
  const { noResultsHits, query } = context;

  return html`
      <ul class="aa-List" role="listbox" aria-labelledby="autocomplete-4-1-label" id="autocomplete-4-1-list">
      ${noResultsHits.map(item => (html`
          <li class="aa-Item" id="autocomplete-4-1-item-1" role="option" aria-selected="false">
            ${itemTemplate({ item, components, html, state })}
          </li >`))}
      </ul>`
}

/**
 * Main Submit Handler
 * @param {} state
 */
const autocompleteSubmitHandler = (state) => {
  if (state.query) {
    updateUrlParameter(`q`, state.query);
  }

  // Validate if you are in the searchPage (Otherwise redirect using q param)
  if (window.location.pathname !== searchConfig.searchPagePath) {
    if (state.query) {
      window.location.assign(`${searchConfig.searchPagePath}?q=${state.query}`);

    } else {
      window.location.assign(`${searchConfig.searchPagePath}`);
    }
  } else {
    console.log('Sending evnt!!', state.query)
    pubsub.publish(QUERY_UPDATE_EVT, {
      query: state.query ? state.query : '',
      index: searchConfig.recordsIndex,
    });
  }
}


// Initialize autocomplete-js
const autocompleteInstance = autocomplete({
  container: '#autocomplete__container',
  placeholder: 'Search for manly goodness',
  openOnFocus: true,
  insights: true,
  onSubmit({ state }) {
    autocompleteSubmitHandler(state);
  },
  render(params, root) {
    const { elements, render, html, state } = params;
    const { hitsPerPage, nbHits, query, navigator } = state.context;
    const { recentSearchesPlugin, querySuggestionsPlugin, products, staticLinks } = elements;
    let productsLabel = 'Most Popular'
    if (query && query != '' && nbHits > 0) {
      productsLabel = `${hitsPerPage} out of ${nbHits} results for "${query}"`;
    } else if (query && query != '' && nbHits == 0) {
      productsLabel = html`<span class="gutter"></span>No results found for <span class="highlighted-text"> "${query}"</span>, but take a look on our top sellers`;
    }
    const submitHandler = (evt) => {
      evt.preventDefault();
      if (state.query) {
         window.location.href = `${searchConfig.searchPagePath}?q=${state.query}`;
      } else {
          window.location.href = `${searchConfig.searchPagePath}`;
      }
    }

    render(
      html`
          <div class="aa-PanelLayout aa-Panel--scrollable">
            <div class="aa-SearchPanel">
              <div class="aa-PanelSections">
                <div class="aa-PanelSection--left">
                    ${getCollection(state.collections, 'recentSearchesPlugin') && getCollection(state.collections, 'recentSearchesPlugin').items.length > 0 ?
          [html`<h2>Recent Searches</h2>`, recentSearchesPlugin] : []
        }
                  ${getCollection(state.collections, "querySuggestionsPlugin") && getCollection(state.collections, "querySuggestionsPlugin").items.length > 0 ?
          [html`<h2>Popular Searches</h2>`, querySuggestionsPlugin] : []
        }
                </div >
                <div class="aa-PanelSection--right aa-Products">
                 <h2>${productsLabel} <span class="aa-SubmitSearch--link" onClick="${submitHandler}">See All</span></h2>
                  ${products}
                  ${staticLinks}
                </div>
              </div >
           </div>
          </div > `,
      root
    );
  },
  plugins: [recentSearchesPlugin, querySuggestionsPlugin, algoliaInsightsPlugin, redirectUrlPlugin],
  initialState: {
    // This uses the `q` query parameter as the initial query
    query: new URL(window.location).searchParams.get('q') || '',
  },
  getSources({ query, setContext }) {
    return [
      {
        sourceId: 'products',
        panelPlacement: 'full-width',
        getItems() {
          return getAlgoliaResults({
            searchClient,
            queries: [
              {
                indexName: searchConfig.recordsIndex,
                query,
                params: {
                  hitsPerPage: 4,
                  attributesToSnippet: ['name:10', 'description:35'],
                  snippetEllipsisText: '…',
                },
              },
              {
                // Making a second query for Non-Results-pages
                indexName: searchConfig.noResultsIndex,
                query: '',
                params: {
                  hitsPerPage: 4,
                  attributesToSnippet: ['name:10', 'description:35'],
                  snippetEllipsisText: '…',
                },
              },

            ],
            getItemUrl({ item }) {
              return item.url
            },
          });
        },
        templates: {
          item: itemTemplate,
          noResults: noResultsTemplate
        }
      },
      {
        sourceId: 'staticLinks',
        getItems() {
          return [
            {
              label: 'Some Static Link to FAQ',
              url: 'https://www.google.com'
            },
            {
              label: 'Other Link to Privacy Policies',
              url: 'https://www.google.com'
            }
          ]
        },
        getItemUrl({ item }) {
          return item.url;
        },
        templates: {
          header() {
            return 'Check this links out!';
          },
          item({ item, html }) {
            return html`
              <div class="aa-ItemWrapper custom-source__container">
                <a class="custom-source__a text-sm text-blue-500" href="${item.url}">
                  ${item.label} >>>
                </a>
              </div>
            `;
          },
          noResults() {
            return 'No matching Amazing LINKS.';
          },
        },
      }
    ];
  },
});
