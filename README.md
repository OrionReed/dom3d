## dom3d

A 3D DOM viewer for Firefox, Chrome, and Safari

**NOTE: Only tested in Firefox and Chrome so far. Help with cross-browser support is welcome.**

## Install
Download the latest [release](https://github.com/OrionReed/dom3d/releases) and unzip the file.

**In Firefox**
1. Go to `about:debugging#/runtime/this-firefox`
2. Click "Load Temporary Addon"
3. Select `manifest.json` in the downloaded folder
4. Extension should now be installed, you can find it in the top right extensions menu (puzzle piece icon) and pin it if desired

**In Chrome**
1. Go to `chrome://extensions`
2. Click "Load Unpacked"
3. Select the downloaded folder
4. Extension should now be installed, you can find it in the top right extensions menu (puzzle piece icon) and pin it if desired

## Usage
- Click the extension icon to toggle 3D DOM view
- Right-Click for options like showing sides, surfaces, randomising color, and enabling zoom.

## Development
1. Run `yarn install`
2. Run `yarn watch` to watch for changes and automatically rebuild the extension, or one of the `build:{browser}` scripts to build a specific browser.
3. Load the extension from `dist/{browser}` following the steps above.

You can use [web-ext](https://github.com/mozilla/web-ext) to reload the extension in Firefox automatically. Chrome requires a manual reload from the `chrome://extensions` page.
