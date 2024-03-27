A 3D DOM viewer for Firefox, Chrome, and Safari

**NOTE: Only tested in Firefox so far. Help with cross-browser support is welcome.**

## Install
From your browser, enable developer mode (or equivelant) and install the extension from the `dist` folder.

**In Firefox**
1. Go to `about:debugging#/runtime/this-firefox`
2. Click "Load Temporary Addon"
3. Select `dom3d/dist/firefox/manifest.json`
4. Extension should now be installed, you can find it in the top right extensions menu (puzzle piece icon) and pin it if desired

**In Chrome**
1. Go to `chrome://extensions`
2. Click "Load Unpacked"
3. Select `dom3d/dist/chrome/manifest.json`
4. Extension should now be installed, you can find it in the top right extensions menu (puzzle piece icon) and pin it if desired

## Usage
- Click extension icon to toggle 3D DOM view
- Right-Click for options (showing sides, surfaces, randomising color, and enabling zoom)

## Development
`yarn build-all` to build all the versions of the extension. You can use [web-ext](https://github.com/mozilla/web-ext) to help develop for Firefox.
