// Getting Dependencies from window
const { algoliasearch, aa } = window;


// Algolia Credentials
const appId = 'HLT7I6OQRX';
const apiKey = 'fbd3ce4b101f6f5c43320714127b53a4';

// Initializing Search Client
export const searchClient = algoliasearch(appId, apiKey);

// Insights Analytics Client Initialization
aa("init", { appId, apiKey, useCookie: true });

// Insights Client
export const insightsClient = aa;

// create and export middleware
export const insightsMiddleware = window.instantsearch ? instantsearch.middlewares.createInsightsMiddleware({insightsClient: aa}): {};

// Configure your indices here
export const searchConfig = {
  // catalogId: "products",
  // catalogLabel: "All Products",
  recordsIndex: "main_search",
  noResultsIndex: "main_search_query_suggestions",
  suggestionsIndex: "main_search_query_suggestions",
  searchPagePath: "/_dev/search-results.html",
};

// Export channel subscription
export const pubsub = new PubSub();