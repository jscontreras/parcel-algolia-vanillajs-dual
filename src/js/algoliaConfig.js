// Getting Dependencies from window
const { algoliasearch, aa } = window;


// Algolia Credentials
const appId = 'latency';
const apiKey = '6be0576ff61c053d5f9a3225e2a90f76';

// Initializing Search Client
export const searchClient = algoliasearch(appId, apiKey);

// Insights Analytics Client Initialization
aa("init", { appId, apiKey });
// Set token for both Authenticated or unauthenticated users.
aa('setUserToken', 'ma-user-999');

// Insights Client
export const insightsClient = aa;

// create and export middleware
export const insightsMiddleware = instantsearch.middlewares.createInsightsMiddleware({insightsClient: aa});

export const searchConfig = {
  catalogId: "products",
  catalogLabel: "All Products",
  recordsIndex: "instant_search",
  noResultsIndex: "instant_search",
  suggestionsIndex: "instant_search_query_suggestions",
  searchPagePath: "/search.html",
};

/**
 * Gets query paramters from URL
 * @returns Returns query from the url
 */
export function getQueryParam(param = 'q') {
  return new URL(window.location).searchParams.get(param);
}

