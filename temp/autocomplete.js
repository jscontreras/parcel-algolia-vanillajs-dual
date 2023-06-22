// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

(function (modules, entry, mainEntry, parcelRequireName, globalName) {
  /* eslint-disable no-undef */
  var globalObject =
    typeof globalThis !== 'undefined'
      ? globalThis
      : typeof self !== 'undefined'
      ? self
      : typeof window !== 'undefined'
      ? window
      : typeof global !== 'undefined'
      ? global
      : {};
  /* eslint-enable no-undef */

  // Save the require from previous bundle to this closure if any
  var previousRequire =
    typeof globalObject[parcelRequireName] === 'function' &&
    globalObject[parcelRequireName];

  var cache = previousRequire.cache || {};
  // Do not use `require` to prevent Webpack from trying to bundle this call
  var nodeRequire =
    typeof module !== 'undefined' &&
    typeof module.require === 'function' &&
    module.require.bind(module);

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire =
          typeof globalObject[parcelRequireName] === 'function' &&
          globalObject[parcelRequireName];
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error("Cannot find module '" + name + "'");
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = (cache[name] = new newRequire.Module(name));

      modules[name][0].call(
        module.exports,
        localRequire,
        module,
        module.exports,
        this
      );
    }

    return cache[name].exports;

    function localRequire(x) {
      var res = localRequire.resolve(x);
      return res === false ? {} : newRequire(res);
    }

    function resolve(x) {
      var id = modules[name][1][x];
      return id != null ? id : x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [
      function (require, module) {
        module.exports = exports;
      },
      {},
    ];
  };

  Object.defineProperty(newRequire, 'root', {
    get: function () {
      return globalObject[parcelRequireName];
    },
  });

  globalObject[parcelRequireName] = newRequire;

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (mainEntry) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(mainEntry);

    // CommonJS
    if (typeof exports === 'object' && typeof module !== 'undefined') {
      module.exports = mainExports;

      // RequireJS
    } else if (typeof define === 'function' && define.amd) {
      define(function () {
        return mainExports;
      });

      // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }
})({"7XZqU":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
// Results html template
parcelHelpers.export(exports, "itemTemplate", ()=>itemTemplate);
// No results template
parcelHelpers.export(exports, "noResultsTemplate", ()=>noResultsTemplate);
// Get Algolia configured clients
var _algoliaConfig = require("./algoliaConfig");
// Helper functions
var _common = require("./common");
const { autocomplete , getAlgoliaResults  } = window["@algolia/autocomplete-js"];
const { createLocalStorageRecentSearchesPlugin  } = window["@algolia/autocomplete-plugin-recent-searches"];
const { createAlgoliaInsightsPlugin  } = window["@algolia/autocomplete-plugin-algolia-insights"];
const { createQuerySuggestionsPlugin  } = window["@algolia/autocomplete-plugin-query-suggestions"];
const { createRedirectUrlPlugin  } = window["@algolia/autocomplete-plugin-redirect-url"];
// Events Plugin
const algoliaInsightsPlugin = createAlgoliaInsightsPlugin({
    insightsClient: (0, _algoliaConfig.insightsClient)
});
// Recent Search Plugin
const recentSearchesPlugin = createLocalStorageRecentSearchesPlugin({
    key: "navbar",
    limit: 3,
    transformSource ({ source  }) {
        return {
            ...source,
            onSelect ({ state  }) {
                autocompleteSubmitHandler(state);
            }
        };
    }
});
// Initializing Redirect Plugin
function transformResponse(results) {
    if (results.query !== "" && results.renderingContent && results.renderingContent.redirect) window.location.href = results.renderingContent.redirect.url;
}
// Redirect via rules Plugin
const redirectUrlPlugin = createRedirectUrlPlugin({
    transformResponse
});
// Query Suggestion Plugin
const querySuggestionsPlugin = createQuerySuggestionsPlugin({
    searchClient: (0, _algoliaConfig.searchClient),
    indexName: (0, _algoliaConfig.searchConfig).suggestionsIndex,
    limit: 6,
    transformSource ({ source  }) {
        return {
            ...source,
            onSelect ({ state  }) {
                autocompleteSubmitHandler(state);
            }
        };
    }
});
function itemTemplate(itemTemplateParams) {
    const { item , components , html , state  } = itemTemplateParams;
    const handleItemNavigation = (evt)=>{
        evt.preventDefault();
        console.log("Implementing this later!!");
    };
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
        attribute: "title"
    })}
          </div>
          <div class="aa-ItemContentDescription">
            ${`$${(0, _common.printFriendlyDollarCents)(item.price)}`}
          </div>
        </div>
      </div>
    </div>
  </div>`;
}
function noResultsTemplate({ state , html , components  }) {
    const { context  } = state;
    const { noResultsHits , query  } = context;
    return html`
      <ul class="aa-List" role="listbox" aria-labelledby="autocomplete-4-1-label" id="autocomplete-4-1-list">
      ${noResultsHits.map((item)=>html`
          <li class="aa-Item" id="autocomplete-4-1-item-1" role="option" aria-selected="false">
            ${itemTemplate({
            item,
            components,
            html,
            state
        })}
          </li >`)}
      </ul>`;
}
/**
 * Main Submit Handler
 * @param {} state
 */ const autocompleteSubmitHandler = (state)=>{
    if (state.query) (0, _common.updateUrlParameter)(`q`, state.query);
    // Validate if you are in the searchPage (Otherwise redirect using q param)
    if (window.location.pathname !== (0, _algoliaConfig.searchConfig).searchPagePath) {
        if (state.query) window.location.assign(`${(0, _algoliaConfig.searchConfig).searchPagePath}?q=${state.query}`);
        else window.location.assign(`${(0, _algoliaConfig.searchConfig).searchPagePath}`);
    } else {
        console.log("Sending evnt!!", state.query);
        (0, _algoliaConfig.pubsub).publish((0, _common.QUERY_UPDATE_EVT), {
            query: state.query ? state.query : "",
            index: (0, _algoliaConfig.searchConfig).recordsIndex
        });
    }
};
// Initialize autocomplete-js
const autocompleteInstance = autocomplete({
    container: "#autocomplete__container",
    placeholder: "Search for manly goodness",
    openOnFocus: true,
    insights: true,
    onSubmit ({ state  }) {
        autocompleteSubmitHandler(state);
    },
    render (params, root) {
        const { elements , render , html , state  } = params;
        const { hitsPerPage , nbHits , query , navigator  } = state.context;
        const { recentSearchesPlugin , querySuggestionsPlugin , products , staticLinks  } = elements;
        let productsLabel = "Most Popular";
        if (query && query != "" && nbHits > 0) productsLabel = `${hitsPerPage} out of ${nbHits} results for "${query}"`;
        else if (query && query != "" && nbHits == 0) productsLabel = html`<span class="gutter"></span>No results found for <span class="highlighted-text"> "${query}"</span>, but take a look on our top sellers`;
        const submitHandler = (evt)=>{
            evt.preventDefault();
            if (state.query) window.location.href = `${(0, _algoliaConfig.searchConfig).searchPagePath}?q=${state.query}`;
            else window.location.href = `${(0, _algoliaConfig.searchConfig).searchPagePath}`;
        };
        render(html`
          <div class="aa-PanelLayout aa-Panel--scrollable">
            <div class="aa-SearchPanel">
              <div class="aa-PanelSections">
                <div class="aa-PanelSection--left">
                    ${(0, _common.getCollection)(state.collections, "recentSearchesPlugin") && (0, _common.getCollection)(state.collections, "recentSearchesPlugin").items.length > 0 ? [
            html`<h2>Recent Searches</h2>`,
            recentSearchesPlugin
        ] : []}
                  ${(0, _common.getCollection)(state.collections, "querySuggestionsPlugin") && (0, _common.getCollection)(state.collections, "querySuggestionsPlugin").items.length > 0 ? [
            html`<h2>Popular Searches</h2>`,
            querySuggestionsPlugin
        ] : []}
                </div >
                <div class="aa-PanelSection--right aa-Products">
                 <h2>${productsLabel} <span class="aa-SubmitSearch--link" onClick="${submitHandler}">See All</span></h2>
                  ${products}
                  ${staticLinks}
                </div>
              </div >
           </div>
          </div > `, root);
    },
    plugins: [
        recentSearchesPlugin,
        querySuggestionsPlugin,
        algoliaInsightsPlugin,
        redirectUrlPlugin
    ],
    initialState: {
        // This uses the `q` query parameter as the initial query
        query: new URL(window.location).searchParams.get("q") || ""
    },
    getSources ({ query , setContext  }) {
        return [
            {
                sourceId: "products",
                getItems () {
                    return getAlgoliaResults({
                        searchClient: (0, _algoliaConfig.searchClient),
                        queries: [
                            {
                                indexName: (0, _algoliaConfig.searchConfig).recordsIndex,
                                query,
                                params: {
                                    hitsPerPage: 4,
                                    attributesToSnippet: [
                                        "name:10",
                                        "description:35"
                                    ],
                                    snippetEllipsisText: "…"
                                }
                            },
                            {
                                // Making a second query for Non-Results-pages
                                indexName: (0, _algoliaConfig.searchConfig).noResultsIndex,
                                query: "",
                                params: {
                                    hitsPerPage: 4,
                                    attributesToSnippet: [
                                        "name:10",
                                        "description:35"
                                    ],
                                    snippetEllipsisText: "…"
                                }
                            }, 
                        ],
                        getItemUrl ({ item  }) {
                            return item.url;
                        }
                    });
                },
                templates: {
                    item: itemTemplate,
                    noResults: noResultsTemplate
                }
            },
            {
                sourceId: "staticLinks",
                getItems () {
                    return [
                        {
                            label: "Some Static Link to FAQ",
                            url: "https://www.google.com"
                        },
                        {
                            label: "Other Link to Privacy Policies",
                            url: "https://www.google.com"
                        }
                    ];
                },
                getItemUrl ({ item  }) {
                    return item.url;
                },
                templates: {
                    header () {
                        return "Check this links out!";
                    },
                    item ({ item , html  }) {
                        return html`
              <div class="aa-ItemWrapper custom-source__container">
                <a class="custom-source__a text-sm text-blue-500" href="${item.url}">
                  ${item.label} >>>
                </a>
              </div>
            `;
                    },
                    noResults () {
                        return "No matching Amazing LINKS.";
                    }
                }
            }
        ];
    }
});

},{"./algoliaConfig":"9Rl6D","./common":"2ASYY","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"9Rl6D":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "searchClient", ()=>searchClient);
parcelHelpers.export(exports, "insightsClient", ()=>insightsClient);
parcelHelpers.export(exports, "insightsMiddleware", ()=>insightsMiddleware);
parcelHelpers.export(exports, "searchConfig", ()=>searchConfig);
parcelHelpers.export(exports, "pubsub", ()=>pubsub);
// Getting Dependencies from window
const { algoliasearch , aa  } = window;
// Algolia Credentials
const appId = "latency";
const apiKey = "6be0576ff61c053d5f9a3225e2a90f76";
const searchClient = algoliasearch(appId, apiKey);
// Insights Analytics Client Initialization
aa("init", {
    appId,
    apiKey
});
// Set token for both Authenticated or unauthenticated users.
aa("setUserToken", "ma-user-999");
const insightsClient = aa;
const insightsMiddleware = window.instantsearch ? instantsearch.middlewares.createInsightsMiddleware({
    insightsClient: aa
}) : {};
const searchConfig = {
    catalogId: "products",
    catalogLabel: "All Products",
    recordsIndex: "instant_search",
    noResultsIndex: "instant_search",
    suggestionsIndex: "instant_search_demo_query_suggestions",
    searchPagePath: "/search.html"
};
const pubsub = new PubSub();

},{"@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"gkKU3":[function(require,module,exports) {
exports.interopDefault = function(a) {
    return a && a.__esModule ? a : {
        default: a
    };
};
exports.defineInteropFlag = function(a) {
    Object.defineProperty(a, "__esModule", {
        value: true
    });
};
exports.exportAll = function(source, dest) {
    Object.keys(source).forEach(function(key) {
        if (key === "default" || key === "__esModule" || dest.hasOwnProperty(key)) return;
        Object.defineProperty(dest, key, {
            enumerable: true,
            get: function() {
                return source[key];
            }
        });
    });
    return dest;
};
exports.export = function(dest, destName, get) {
    Object.defineProperty(dest, destName, {
        enumerable: true,
        get: get
    });
};

},{}],"2ASYY":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "QUERY_UPDATE_EVT", ()=>QUERY_UPDATE_EVT);
/**
 * Gets query paramters from URL
 * @returns Returns query from the url
 */ parcelHelpers.export(exports, "getQueryParam", ()=>getQueryParam);
/**
 * Prints a friendly dollar cents quantity.
 * @param {number} quantity - The quantity to be printed.
 */ parcelHelpers.export(exports, "printFriendlyDollarCents", ()=>printFriendlyDollarCents);
/**
 * Finds a collection item from an array of collections based on the sourceId.
 *
 * @param {Array} collections - The array of collections.
 * @param {string} sourceId - The sourceId to search for.
 * @returns {Object|undefined} The found collection item, or undefined if not found.
 */ parcelHelpers.export(exports, "getCollection", ()=>getCollection);
/**
 * Updates the value of a query param in the URL
 */ parcelHelpers.export(exports, "updateUrlParameter", ()=>updateUrlParameter);
const QUERY_UPDATE_EVT = "QUERY_UPDATE_EVT";
function getQueryParam(param = "q") {
    return new URL(window.location).searchParams.get(param);
}
function printFriendlyDollarCents(quantity) {
    return quantity.toFixed(2);
}
function getCollection(collections, sourceId) {
    if (collections.length) return collections.find((collectionItem)=>{
        return collectionItem.source.sourceId === sourceId;
    });
    return null;
}
function updateUrlParameter(key, value) {
    // Get the current URL search params
    let searchParams = new URLSearchParams(window.location.search);
    // Update or add the parameter
    searchParams.set(key, value);
    // Build the new URL with the updated search params
    let newUrl = window.location.origin + window.location.pathname + "?" + searchParams.toString();
    // Replace the current URL with the new URL
    window.history.replaceState({
        path: newUrl
    }, "", newUrl);
}

},{"@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}]},["7XZqU"], "7XZqU", "parcelRequiree6dd")

//# sourceMappingURL=search.fcda350d.js.map
