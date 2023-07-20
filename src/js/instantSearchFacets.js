import { dynamicWidgets, refinementList, hierarchicalMenu, panel, menu } from 'instantsearch.js/es/widgets';

/**
 * Facets top dynamic widget
 */
export const dynamicFacetsWidget = dynamicWidgets({
  container: '#facets__container',
  widgets: [],
  facets: ['*'],
  widgets: [
    container => {
      const attributes = [
        'hierarchicalCategories.lvl0',
        'hierarchicalCategories.lvl1',
        'hierarchicalCategories.lvl2',
      ];
      return panel({
        templates: {
          header(options, { html }) {
            if (options.results) {
              return html`<h3>Categories Hierarchy:</h3>`;
            }
          },
        }
      })(hierarchicalMenu)({ container, attributes });
    },
  ],
  fallbackWidget: ({ container, attribute }) => {
    return panel({
      templates: {
        header(options, { html }) {
          if (options.items.length > 0 && !attribute.includes(".lvl")) {
            return html`<h3>${attribute}:</h3>`;
          }
        },
      }
    })(refinementList)({ container, attribute });
  }
});
