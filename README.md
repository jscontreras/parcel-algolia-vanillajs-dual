# Algolia VanillaJS Demo
## Installation
Use the recommended node version (`.nvmrc`). If you have `nvm` then run `nvm use` to load the corresponding node version automatically.

## Configuration
It is recommended to use the default configurations for testing the integration with your website first (see the **Installing the Algolia Prototype in your website section**). Once it's working, proceed with the corresponding configuration from the Algolia dashboard.

Once the Index configuration is ready, proceed to update the code as follows:
1. Update your Algolia credentials and indices configurations located within `src/js/algoliaConfig.js`.
2. Update the Autocomplete `itemTemplate` function to match your record's attributes (`src/js/autocomplete.js`.
3. Update the `itemTemplate` function to match your record's attributes (`src/instantSearch.js`).
## Local Development
Run `npm run start` to get the local server running. This server will refresh anytime your code is updated.

> The `searchPagePath` configuration variable is going to be used to connect your search bar with your search page. The URL redirection will not be used in ***Local Development*** but once your assets are exported and installed, the configured `searchPagePath` will be used to redirect users to the specified results page.

## Installing the Algolia prototype in your website
### 1. Export Compiled Assets
Export the corresponding code assets by running `npm run build`. It will produce 4 files within the `dist` folder.
- `algolia-search-bar.css` Styles for Search Bar (Autocomplete).
- `algolia-search-bar.js` Script for Search Bar (Autocomplete).
- `algolia-search-results.css` Styles for Search Results Page (InstantSearch).
- `algolia-search-results.js` Script for SSearch Results Page (InstantSearch).

Make sure you upload all the files in your web platform so they can be located using URLs.
> We'll use `ALGOLIA_ASSETS_URL` as a reference for the URL you'll use to upload your assets.

### 2. Add the search bar.
  - a) Within your platform, locate the place where your Navigation Bar is located (or wherever you want to add the search bar) and include the following code.
  ```html
      <div id="autocomplete__container" ></div>
  ```
  - b) Include the css so it can be loaded every time the search bar is loaded. Use your corresponding `ALGOLIA_ASSETS_URL` URL where you upoaded the `algolia-search-bar.css` file.
   > There is usually a template/section where other external css and js files are added globally.
  ```html
    <link rel="stylesheet" href="{ALGOLIA_ASSETS_URL}/algolia-search-bar.css">
  ```
  - c) Include the `algolia-search-bar.js` script so it can be loaded every time the search bar is laoded. Use your corresponding `ALGOLIA_ASSETS_URL` URL where you upoaded the `algolia-search-bar.js` file.
  > There is usually a template/section where other external css and js files are added globally.
```html
  <script src="{ALGOLIA_ASSETS_URL}/algolia-search-bar.js" type="module"></script>
```
### 3. Add the search results section.
- a) Within your platform, locate the Results Page section that renders the results and include the following markup.
  ```html
    <link rel="stylesheet" href="{ALGOLIA_ASSETS_URL}/algolia-search-results.css">

    <!-- InstantSearch containers!! BEGINNING-->
    <div class="ais__main-container">
      <div class="ais__main-container--header">
        <button class="filters-trigger__btn"><span class="flters-trigger__count"></span></button>
        <button class="filters-close__btn">×</span></button>
        <div id="sort-by__container"></div>
      </div>
      <div class="ais__main-container--content">
        <div class="ais__main-container--left">
          <div id="current-refinements"></div>
          <div id="facets__container"></div>
        </div>
        <div class="ais__main-container--center">
          <div id="searchbox__container" class="pb-2"></div>
          <div id="hits-default__container"></div>
          <div id="hits-non-results__container"></div>
          <div id="pagination" class="p-8 text-center"></div>
        </div>
      </div>
    </div>
    <!-- InstantSearch containers!! END -->

    <script src="{ALGOLIA_ASSETS_URL}/algolia-search-results.js" type="module"></script>
  ```
  > If you can, place the `<script>` and `<link`> tag in the dedicated sections for scripts and styles of the search page (We added all at the same place for simplicity).

# Disclaimer
The code in this repository is provided as-is and is not production-ready. It is intended to be used as a reference only and may contain bugs or other issues. The repository owner is not responsible for any damages or losses that may occur from the use of this code. Use at your own risk.
