// 3D Dom viewer, copy-paste into console to visualise the DOM as a stack of solid blocks
(() => {
  const getDOMDepth = element => [...element.children].reduce((max, child) => Math.max(max, getDOMDepth(child)), 0) + 1;
  const getColorByDepth = (depth, hue = 0, lighten = 0, opacity = 1) => `hsla(${hue}, 75%, ${Math.min(10 + depth * (1 + 60 / getDOMDepth(document.body)), 90) + lighten}%,${opacity})`;

  // Config
  const COLOR_SURFACES = true;
  const COLOR_SIDES = true;
  const COLOR_HUE = 190;
  const COLOR_OPACITY = 1;
  const MAX_ROTATION = 180;
  const DEPTH_INCREMENT = 30;
  const PERSPECTIVE = 1000;
  const SIDE_FACE_CLASS = 'side-face';

  // Freate side faces for an element to give it a 3D appearance
  function createSideFaces(element, depthLevel) {
    const width = element.offsetWidth;
    const height = element.offsetHeight;
    const color = getColorByDepth(depthLevel, 190, -5, COLOR_OPACITY);

    const baseStyle = {
      transformStyle: "preserve-3d",
      position: 'absolute',
      background: color,
      overflow: 'hidden',
      willChange: 'transform',
      top: '0px',
      left: '0px',
      // width: `${width}px`,
      // height: `${DEPTH_INCREMENT}px`, // Height is the DEPTH_INCREMENT for thickness
      // transform: 'rotateX(-90deg)',
      // transformOrigin: 'top',
    }

    const faces = [
      {
        width: `${width}px`,
        height: `${DEPTH_INCREMENT}px`, // Height is the DEPTH_INCREMENT for thickness
        transform: 'rotateX(-90deg)',
        transformOrigin: 'top',
        // transformStyle: "preserve-3d",
        // position: 'absolute',
        // background: color,
        // overflow: 'hidden',
        // willChange: 'transform',
        // top: '0px', // Aligning exactly at the top edge
        // left: '0px', // Ensure it aligns to the left edge
      },
      {
        width: `${DEPTH_INCREMENT}px`,
        height: `${height}px`,
        transform: `translateX(${DEPTH_INCREMENT}px) rotateY(90deg)`,
        transformOrigin: 'left',
        // transformStyle: "preserve-3d",
        // position: 'absolute',
        // background: color,
        // overflow: 'hidden',
        // willChange: 'transform',
        // top: '0px',
        // right: '0px',
      },
      {
        width: `${width}px`,
        height: `${DEPTH_INCREMENT}px`,
        transform: 'rotateX(90deg)',
        transformOrigin: 'bottom',
        // transformStyle: "preserve-3d",
        // position: 'absolute',
        // background: color,
        // overflow: 'hidden',
        // willChange: 'transform',
        // bottom: '0px', // Aligning at the bottom edge of the element
        // left: '0px',
      },
      {
        width: `${DEPTH_INCREMENT}px`,
        height: `${height}px`,
        transform: `translateX(${-DEPTH_INCREMENT}px) rotateY(-90deg)`,
        transformOrigin: 'right',
        // transformStyle: "preserve-3d",
        // position: 'absolute',
        // background: color,
        // Position and rotate the left face
        // overflow: 'hidden',
        // willChange: 'transform',
        // top: '0px',
        // left: '0px',
      }
    ];

    for (const face of faces) {
      const elem = document.createElement('div');
      elem.className = SIDE_FACE_CLASS;
      Object.assign(elem.style, baseStyle);
      Object.assign(elem.style, face);
      element.appendChild(elem);
    }
  }

  // Recursive function to traverse child nodes, apply 3D styles, and create side faces
  function traverseDOM(parentNode, depthLevel, offsetX, offsetY) {
    for (let children = parentNode.childNodes, childrenCount = children.length, i = 0; i < childrenCount; i++) {
      const childNode = children[i];
      if (1 === childNode.nodeType && !childNode.classList.contains(SIDE_FACE_CLASS)) {

        Object.assign(childNode.style, {
          transform: `translateZ(${DEPTH_INCREMENT}px)`,
          overflow: "visible",
          transformStyle: "preserve-3d",
          backgroundColor: COLOR_SURFACES ? getColorByDepth(depthLevel, COLOR_HUE, 0, COLOR_OPACITY) : 'transparent',
          willChange: 'transform',
        });


        let updatedOffsetX = offsetX;
        let updatedOffsetY = offsetY;
        if (childNode.offsetParent === parentNode) {
          updatedOffsetX += parentNode.offsetLeft;
          updatedOffsetY += parentNode.offsetTop;
        }
        createSideFaces(childNode, depthLevel);
        traverseDOM(childNode, depthLevel + 1, updatedOffsetX, updatedOffsetY);
      }
    }
  }

  // Apply initial styles to the body to enable 3D perspective
  const body = document.body;
  body.style.overflow = "visible";
  body.style.transformStyle = "preserve-3d";
  body.style.perspective = PERSPECTIVE;
  const perspectiveOriginX = (window.innerWidth / 2);
  const perspectiveOriginY = (window.innerHeight / 2);
  body.style.perspectiveOrigin = body.style.transformOrigin = `${perspectiveOriginX}px ${perspectiveOriginY}px`;
  traverseDOM(body, 0, 0, 0);

  // Event listener to rotate the DOM based on mouse movement
  document.addEventListener("mousemove", (event) => {
    const rotationY = (MAX_ROTATION * (1 - event.screenY / screen.height) - (MAX_ROTATION / 2));
    const rotationX = (MAX_ROTATION * event.screenX / screen.width - (MAX_ROTATION / 2));
    body.style.transform = `rotateX(${rotationY}deg) rotateY(${rotationX}deg)`;
  });
})()