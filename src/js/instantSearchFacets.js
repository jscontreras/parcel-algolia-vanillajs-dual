import { dynamicWidgets, refinementList, hierarchicalMenu, panel, rangeSlider, ratingMenu, toggleRefinement} from 'instantsearch.js/es/widgets';
import { friendlyAttributeName } from './algoliaConfig';

/**
 * Facets top dynamic widget
 */
export const dynamicFacetsWidget = dynamicWidgets({
  container: '#facets__container',
  widgets: [],
  facets: ['*'],
  widgets: [
    container => {
      const attribute = 'hierarchical_categories';
      const attributes = [
        'hierarchical_categories.lvl0',
        'hierarchical_categories.lvl1',
        'hierarchical_categories.lvl2',
      ];
      return panel({
        templates: {
          header(options, { html }) {
            if (options.results && options.results.hits.length > 0) {
              return html`<h3>${friendlyAttributeName(attribute)}:</h3>`;
            }
          },
        }
      })(hierarchicalMenu)({ container, attributes, escapeFacetValues:false });
    },
    container => {
      const attribute = 'price.value';
      return panel({
        templates: {
          header(options, { html }) {
            console.log('options', options)
            if (options.results && options.results.hits.length > 0) {
              return html`<h3>${friendlyAttributeName(attribute)}:</h3>`;
            }
          },
        }
      })(rangeSlider)({ container, attribute });
    },
    container => {
      const attribute = 'reviews.rating';
      return panel({
        templates: {
          header(options, { html }) {
            if (options.results && options.results.hits.length > 0) {
              return html`<h3>${friendlyAttributeName(attribute)}:</h3>`;
            }
          },
        }
      })(ratingMenu)({ container, attribute });
    },
    container => {
      const attribute = 'price.on_sales';
      return panel({
        templates: {
          header(options, { html }) {
            if (options.results && options.results.hits.length > 0) {
              return html`<h3>${friendlyAttributeName(attribute)}:</h3>`;
            }
          },
        }
      })(toggleRefinement)({
        container, attribute, templates: {
          labelText: friendlyAttributeName(attribute), // Text to display next to the toggle
        }, });
    }
  ],
  fallbackWidget: ({ container, attribute }) => {
    return panel({
      templates: {
        header(options, { html }) {
          if (options.items.length > 0 && !attribute.includes(".lvl")) {
            return html`<h3>${friendlyAttributeName(attribute)}:</h3>`;
          }
        },
      }
    })(refinementList)({ container, attribute });
  }
});
