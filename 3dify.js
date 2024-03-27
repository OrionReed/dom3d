(function () {
  const MAX_ROTATION = 180;
  const DEPTH_INCREMENT = 25;
  const PERSPECTIVE = 1000;
  const SIDE_FACE_CLASS = 'side-face';
  const MAX_DOM_DEPTH = getMaxDepth(document.body);

  // Calculate color based on depth, ensuring lighter colors for deeper elements
  function getColorByDepth(depth) {
    return `hsl(190, 75%, ${Math.min(10 + depth * (1 + 60 / MAX_DOM_DEPTH), 90)}%)`;
  }

  // Calculate the maximum depth of the DOM tree
  function getMaxDepth(element) {
    return Array.from(element.children).reduce((max, child) =>
      Math.max(max, getMaxDepth(child)), 0) + 1;
  }

  // Freate side faces for an element to give it a 3D appearance
  function createSideFaces(element, depthLevel) {
    const width = element.offsetWidth;
    const height = element.offsetHeight;
    const color = getColorByDepth(depthLevel);

    const faces = [
      {
        transform: `translateX(${width}px) rotateY(90deg)`,
        width: DEPTH_INCREMENT,
        height: height
      },
      {
        transform: `translateX(-${DEPTH_INCREMENT}px) rotateY(-90deg)`,
        width: DEPTH_INCREMENT,
        height: height
      },
      {
        transform: `translateY(-${DEPTH_INCREMENT}px) rotateX(90deg)`,
        width: width,
        height: DEPTH_INCREMENT
      },
      {
        transform: `translateY(${height}px) rotateX(-90deg)`,
        width: width,
        height: DEPTH_INCREMENT
      }
    ];

    // Create a face for each side of the element
    faces.forEach(({ transform, width, height }) => {
      const face = document.createElement('div');
      face.className = SIDE_FACE_CLASS;
      Object.assign(face.style, {
        transformStyle: "preserve-3d",
        position: 'absolute',
        width: `${width}px`,
        height: `${height}px`,
        background: color,
        transform: transform,
        overflow: 'hidden',
        backfaceVisibility: 'hidden',
        willChange: 'transform',
        zIndex: `${depthLevel}`
      })
      element.appendChild(face);
    });
  }

  // Recursive function to traverse child nodes, apply 3D styles, and create side faces
  function traverseChildren(parentNode, depthLevel, offsetX, offsetY) {
    for (let children = parentNode.childNodes, childrenCount = children.length, i = 0; i < childrenCount; i++) {
      const childNode = children[i];
      if (1 === childNode.nodeType && !childNode.classList.contains(SIDE_FACE_CLASS)) {
        Object.assign(childNode.style, {
          transform: `translateZ(${DEPTH_INCREMENT}px)`,
          position: 'relative',
          backfaceVisibility: 'hidden',
          overflow: "visible",
          transformStyle: "preserve-3d",
          zIndex: `${depthLevel}`,
          backgroundColor: `#${Math.floor(Math.random() * 16777215).toString(16)}`, // Random color face while debugging
          willChange: 'transform',
        });


        childNode.offsetParent === parentNode && (offsetX += parentNode.offsetLeft, offsetY += parentNode.offsetTop);
        createSideFaces(childNode, depthLevel);
        traverseChildren(childNode, depthLevel + 1, offsetX, offsetY);
      }
    }
  }

  // Apply initial styles to the body to enable 3D perspective
  const body = document.body;
  body.style.overflow = "visible";
  body.style.transformStyle = "preserve-3d";
  body.style.backfaceVisibility = 'hidden';
  body.style.perspective = PERSPECTIVE;
  const perspectiveOriginX = (window.innerWidth / 2);
  const perspectiveOriginY = (window.innerHeight / 2);
  body.style.perspectiveOrigin = body.style.transformOrigin = `${perspectiveOriginX}px ${perspectiveOriginY}px`;
  traverseChildren(body, 0, 0, 0);

  // Event listener to rotate the DOM based on mouse movement
  document.addEventListener("mousemove", (event) => {
    const rotationY = (MAX_ROTATION * (1 - event.screenY / screen.height) - (MAX_ROTATION / 2));
    const rotationX = (MAX_ROTATION * event.screenX / screen.width - (MAX_ROTATION / 2));
    body.style.transform = `rotateX(${rotationY}deg) rotateY(${rotationX}deg)`;
  });
})()