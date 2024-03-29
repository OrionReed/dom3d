## dom3d

A 3D DOM viewer for Firefox, Chrome, and Safari

**NOTE: Only tested in Firefox and Chrome so far. Help with cross-browser support is welcome.**

## Install
Download the latest [release](https://github.com/OrionReed/dom3d/releases) and unzip the file.

<details>
<summary><b>Tiny Bookmarklet version</b></summary>
Simply prefix this code with `javascript:` and save it as a bookmark on Chrome or Firefox. This is a 1-1 equivelant to the full extension with the default configuration.

```js
(()=>{let e=t=>[...t.children].reduce((t,n)=>Math.max(t,e(n)),0)+1,t=e(document.body),n=(e,n=0,o=0)=>`hsl(${n}, 75%, ${Math.min(10+e*(1+60/t),90)+o}%)`,o=document.body;o.style.overflow="visible",o.style.transformStyle="preserve-3d",o.style.perspective=1e4;let r=window.innerWidth/2,i=window.innerHeight/2;o.style.perspectiveOrigin=o.style.transformOrigin=`${r}px ${i}px`,function e(t,o,r,i){for(let l=t.childNodes,s=l.length,d=0;d<s;d++){let s=l[d];if(1!==s.nodeType)continue;let f=n(o,190,-5);Object.assign(s.style,{transform:"translateZ(20px)",overflow:"visible",transformStyle:"preserve-3d",backgroundColor:f});let a=r,c=i;s.offsetParent===t&&(a+=t.offsetLeft,c+=t.offsetTop),e(s,o+1,a,c)}}(o,0,0,0),document.addEventListener("mousemove",e=>{let t=180*(1-e.clientY/window.innerHeight)-90,n=180*e.clientX/window.innerWidth-90;o.style.transform=`rotateX(${t}deg) rotateY(${n}deg)`})})();
```
</details>

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

## Known Issues
All help in diagnosing and fixing these key issues is welcome! I've linked to an Issue for each of them.
- [The z-ordering of DOM elements from the 'cameras' perspective is incorrect in some cases.](https://github.com/OrionReed/dom3d/issues/9)
- [Some websites (like GitHub) appear flat when their DOM clearly isn't.](https://github.com/OrionReed/dom3d/issues/10)
- [Some elements don't increase stack height, such as `<a>` and `<i>` tags.](https://github.com/OrionReed/dom3d/issues/11)
