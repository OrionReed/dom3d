// 3D Dom viewer, copy-paste into console to visualise the DOM as a stack of solid blocks
(() => {
  const getDOMDepth = element => [...element.children].reduce((max, child) => Math.max(max, getDOMDepth(child)), 0) + 1;
  const domDepthCache = getDOMDepth(document.body);
  const getColorByDepth = (depth, hue = 0, lighten = 0, opacity = 1) => `hsla(${hue}, 75%, ${Math.min(10 + depth * (1 + 60 / domDepthCache), 90) + lighten}%,${opacity})`;

  // Config
  const COLOR_SURFACES = true;
  const COLOR_SIDES = true;
  const COLOR_HUE = 190;
  const COLOR_OPACITY = 1;
  const MAX_ROTATION = 180;
  const DEPTH_INCREMENT = 30;
  const PERSPECTIVE = 1000;
  const SIDE_FACE_CLASS = 'side-face';

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

  // Create side faces for an element to give it a 3D appearance
  function createSideFaces(element, depthLevel) {
    const width = element.offsetWidth;
    const height = element.offsetHeight;
    const color = getColorByDepth(depthLevel, 190, -5, COLOR_OPACITY);
    const fragment = document.createDocumentFragment();

    // Helper function to create and style a face
    const createFace = ({ width, height, transform, transformOrigin, top, left, right, bottom }) => {
      const face = document.createElement('div');
      face.className = SIDE_FACE_CLASS;
      Object.assign(face.style, {
        transformStyle: "preserve-3d",
        position: 'absolute',
        width: `${width}px`,
        height: `${height}px`,
        background: color,
        transform,
        transformOrigin,
        overflow: 'hidden',
        willChange: 'transform',
        top,
        left,
        right,
        bottom
      });
      fragment.appendChild(face);
    }

    // Top face
    createFace({
      width,
      height: DEPTH_INCREMENT,
      transform: 'rotateX(-90deg)',
      transformOrigin: 'top',
      top: '0px',
      left: '0px'
    });

    // Right face
    createFace({
      width: DEPTH_INCREMENT,
      height,
      transform: 'rotateY(90deg)',
      transformOrigin: 'left',
      top: '0px',
      left: `${width}px`
    });

    // Bottom face
    createFace({
      width,
      height: DEPTH_INCREMENT,
      transform: 'rotateX(90deg)',
      transformOrigin: 'bottom',
      bottom: '0px',
      left: '0px'
    });

    // Left face
    createFace({
      width: DEPTH_INCREMENT,
      height,
      transform: `translateX(${-DEPTH_INCREMENT}px) rotateY(-90deg)`,
      transformOrigin: 'right',
      top: '0px',
      left: '0px'
    });

    element.appendChild(fragment);
  }

  // Recursive function to traverse child nodes, apply 3D styles, and create side faces
  function traverseDOM(parentNode, depthLevel, offsetX, offsetY) {
    for (let children = parentNode.childNodes, childrenCount = children.length, i = 0; i < childrenCount; i++) {
      const childNode = children[i];
      if (!(1 === childNode.nodeType && !childNode.classList.contains(SIDE_FACE_CLASS))) continue;
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
})()