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
})({"80GWT":[function(require,module,exports) {
var _algoliaConfig = require("./algoliaConfig");
var _common = require("./common");
const { instantsearch  } = window;
const { connectSearchBox  } = instantsearch.connectors;
// Read the query attribute if any
const initialQuery = (0, _common.getQueryParam)();
const initialUiState = {};
// Update InitialUIState if there is a query in the url
if (initialQuery !== "") initialUiState[(0, _algoliaConfig.searchConfig).recordsIndex] = {
    query: initialQuery
};
else initialUiState[(0, _algoliaConfig.searchConfig).recordsIndex] = {};
// Create instantSearch instance using instant_search index and client
const myInstantSearch = instantsearch({
    indexName: (0, _algoliaConfig.searchConfig).recordsIndex,
    searchClient: (0, _algoliaConfig.searchClient),
    initialUiState
});
/**
 * INSTANT SEARCH WIDGETS
 */ // Instant Search Global Configuration Widget
const myInstantSearchGlobalConfig = instantsearch.widgets.configure({
    hitsPerPage: 10
});
// Add custom SearchBox render that listens to Autocomplete but doesn't render anything
const renderSearchBox = ({ refine , instantSearchInstance  }, isFirstRender)=>{
    // Rendering logic for listening from Autocomplete events.
    if (isFirstRender) (0, _algoliaConfig.pubsub).subscribe((0, _common.QUERY_UPDATE_EVT), (data, _msg)=>{
        if (data.index === instantSearchInstance.indexName) refine(data.query);
    });
};
// Connect custom searchbox render with connectSearchBox
const customSearchBox = connectSearchBox(renderSearchBox);
// Instanciate your custom searchBox widget
const customSearchBoxWidget = customSearchBox({
    container: "#searchbox__container"
});
// Template for rendering results
const myHitsCustomTemplate = instantsearch.widgets.hits({
    container: "#hits-default__container",
    templates: {
        item (hit, { html , components , sendEvent  }) {
            return html`<article class="pb-8">
      <a href="#" onClick="${(evt)=>{
                evt.preventDefault();
                sendEvent("click", hit, "Result Clicked");
                window.location.href = hit.url;
            }}" class="text-blue-400">
        ${components.Highlight({
                attribute: "name",
                hit
            })}
      </a>
      <img src="${hit.image}"/>
      <p>${components.Snippet({
                attribute: "description",
                hit
            })}</p>
      <button class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded absolute bottom-5" onClick="${(evt)=>{
                evt.preventDefault();
                sendEvent("conversion", hit, "Product Added to Cart");
            }}">
        Add to Cart +
      </button>
    </article>`;
        }
    }
});
const myPaginator = instantsearch.widgets.pagination({
    container: "#pagination"
});
// Array for InstantSearch widgets
const widgets = [
    myInstantSearchGlobalConfig,
    customSearchBoxWidget,
    myHitsCustomTemplate,
    myPaginator
];
// Adding the widgets to the InstantSearch instance
myInstantSearch.addWidgets(widgets);
myInstantSearch.use((0, _algoliaConfig.insightsMiddleware));
// Initialize InstantSearch
myInstantSearch.start();

},{"./algoliaConfig":"9Rl6D","./common":"2ASYY"}]},["80GWT"], "80GWT", "parcelRequiree6dd")

//# sourceMappingURL=search.73ef5af3.js.map
