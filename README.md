<div align="center">
  <img width="60" height="60" src="https://github.com/OrionReed/dom3d/assets/16704290/126a738c-1a22-43ac-a209-b465afe73b17"/>
  <h3 style="margin-top: 0;">dom3d: a tiny spatial DOM viewer</h3>
  <img src="https://img.shields.io/badge/Chrome-Supported-brightgreen">
  <img src="https://img.shields.io/badge/Firefox-Supported-brightgreen">
  <img src="https://img.shields.io/badge/Microsoft%20Edge-Supported-brightgreen">
  <img src="https://img.shields.io/badge/Opera-Supported-brightgreen">
  <img src="https://img.shields.io/badge/Brave-Supported-brightgreen">
  <img src="https://img.shields.io/badge/Safari-Unsupported-red">
</div> 


### Installation
You can install this extension from the [Firefox](https://addons.mozilla.org/en-US/firefox/addon/dom3d/) and [Chrome](https://chromewebstore.google.com/detail/dom3d/lhdhfmkagpnfjjdgbionncpiolioknpj) extension stores or download the latest [release](https://github.com/OrionReed/dom3d/releases) and follow the instructions for your browser below.

<details>
<summary><b>Universal bookmarklet version</b></summary>
Simply prefix this code with `javascript:` and save it as a bookmark on Chrome or Firefox. This is a 1-1 equivalent to the full extension with the default configuration.

```js
(()=>{let e=t=>[...t.children].reduce((t,n)=>Math.max(t,e(n)),0)+1,t=e(document.body),n=(e,n=0,o=0)=>`hsl(${n}, 75%, ${Math.min(10+e*(1+60/t),90)+o}%)`,o=document.body;o.style.overflow="visible",o.style.transformStyle="preserve-3d",o.style.perspective=1e4;let r=window.innerWidth/2,i=window.innerHeight/2;o.style.perspectiveOrigin=o.style.transformOrigin=`${r}px ${i}px`,function e(t,o,r,i){for(let l=t.childNodes,s=l.length,d=0;d<s;d++){let s=l[d];if(1!==s.nodeType)continue;let f=n(o,190,-5);Object.assign(s.style,{transform:"translateZ(20px)",overflow:"visible",transformStyle:"preserve-3d",backgroundColor:f});let a=r,c=i;s.offsetParent===t&&(a+=t.offsetLeft,c+=t.offsetTop),e(s,o+1,a,c)}}(o,0,0,0),document.addEventListener("mousemove",e=>{let t=180*(1-e.clientY/window.innerHeight)-90,n=180*e.clientX/window.innerWidth-90;o.style.transform=`rotateX(${t}deg) rotateY(${n}deg)`})})();
```
</details>

<details>
<summary><b>In Firefox</b></summary>

1. Go to `about:debugging#/runtime/this-firefox`
2. Click "Load Temporary Addon"
3. Select `manifest.json` in the downloaded folder
4. Extension should now be installed, you can find it in the top right extensions menu (puzzle piece icon) and pin it if desired
</details>

<details>
<summary><b>In Chrome/Chromium browsers</b></summary>

1. Go to `chrome://extensions`
2. Enable "Developer Mode" in the top right
3. Click "Load Unpacked"
4. Select the downloaded folder
5. Extension should now be installed, you can find it in the top right extensions menu (puzzle piece icon) and pin it if desired  

**Specific Chromium browsers may have additional steps.**
- In Opera, enable "Allow access to search page results"
</details>

<details>
<summary><b>In Microsoft Edge</b></summary>

1. Go to `edge://extensions`
2. Click "Load Unpacked"
3. Select the downloaded folder. Please use the Chrome version of the extension.
4. Extension should now be installed, you can find it in the top right extensions menu (puzzle piece icon) and pin it if desired
</details>

## Usage
Click the extension icon to enable 3D DOM view or right-click it for options.

| Option                | Description                                            |
|-----------------------|--------------------------------------------------------|
| Show Sides            | Toggle visibility of element sides                     |
| Show Surfaces         | Toggle visibility of element surfaces                  |
| Randomize Color       | Apply random colors to elements                        |
| Enable Zoom           | Enable zoom functionality                              |
| Rotate with Alt+Drag  | Rotate view only when dragging and Alt key is pressed  |
| Choose Selectors      | Set CSS selectors to selectively color elements        |

## Development
1. Run `yarn install`
2. Run `yarn watch` to watch for changes and automatically rebuild the extension.
3. Load the extension from `dist/{browser}` following the steps above.

For Safari, you can run `xcrun safari-web-extension-converter dist/safari` and try to go from there. No success so far.

## Known Issues
All help in diagnosing and fixing these key issues is welcome! I've linked to an Issue for each of them.
- [The z-ordering of DOM elements from the 'cameras' perspective is incorrect in some cases.](https://github.com/OrionReed/dom3d/issues/9)
- [Some websites (like GitHub) appear flat when their DOM clearly isn't.](https://github.com/OrionReed/dom3d/issues/10)
- [Some elements don't increase stack height, such as `<a>` and `<i>` tags.](https://github.com/OrionReed/dom3d/issues/11)
