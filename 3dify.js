// 3D Dom viewer, copy-paste into console to visualise the DOM as a stack of solid blocks
(() => {
  const MAX_ROTATION = 180;
  const DEPTH_INCREMENT = 50;
  const PERSPECTIVE = 1000;
  const SIDE_FACE_CLASS = 'side-face';
  const MAX_DOM_DEPTH = getMaxDepth(document.body);

  // Calculate color based on depth, ensuring lighter colors for deeper elements
  function getColorByDepth(depth, hue = 0, lighten = 0) {
    return `hsl(${hue}, 75%, ${Math.min(10 + depth * (1 + 60 / MAX_DOM_DEPTH), 90) + lighten}%)`;
  }

  // Function to create a random low saturation color
  function getRandomColor() {
    const startHue = 100; // Starting hue at 0
    const endHue = 300; // Ending hue at 360
    const hue = startHue + Math.floor(Math.random() * (endHue - startHue)); // Random hue within the range
    const saturation = 40 + Math.floor(Math.random() * 30); // Low saturation between 10% to 30%
    const lightness = 60 + Math.floor(Math.random() * 20); // Lightness between 50% to 70%
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  }

  // Calculate the maximum depth of the DOM tree
  function getMaxDepth(element) {
    return Array.from(element.children).reduce((max, child) =>
      Math.max(max, getMaxDepth(child)), 0) + 1;
  }

  // Freate side faces for an element to give it a 3D appearance
  function createSideFaces(element, depthLevel) {
    const width = element.offsetWidth;
    const color = getColorByDepth(depthLevel, 190, -5);

    // Creating only the top face
    const topFace = document.createElement('div');
    topFace.className = SIDE_FACE_CLASS;
    Object.assign(topFace.style, {
      transformStyle: "preserve-3d",
      position: 'absolute',
      width: `${width}px`,
      height: `${DEPTH_INCREMENT}px`, // Height is the DEPTH_INCREMENT for thickness
      background: color,
      // Correcting the transform to rotate around the bottom edge
      transform: 'rotateX(-90deg)',
      transformOrigin: 'top',
      overflow: 'hidden',
      willChange: 'transform',
      top: '0px', // Aligning exactly at the top edge
      left: '0px', // Ensure it aligns to the left edge
    });

    element.appendChild(topFace);
  }

  function adjustPositionAndPreserveLayout(element) {
    // Calculate original position
    const originalOffsetTop = element.offsetTop;
    const originalOffsetLeft = element.offsetLeft;

    // Set position to absolute and move to the calculated position
    element.style.position = 'absolute';
    element.style.top = `${originalOffsetTop}px`;
    element.style.left = `${originalOffsetLeft}px`;

    // Optionally, set width and height explicitly if needed
    element.style.width = `${element.offsetWidth}px`;
    element.style.height = `${element.offsetHeight}px`;

    // Insert a placeholder if necessary to maintain document flow
    const placeholder = document.createElement('div');
    placeholder.style.width = `${element.offsetWidth}px`;
    placeholder.style.height = `${element.offsetHeight}px`;
    element.parentNode.insertBefore(placeholder, element);
  }

  // Recursive function to traverse child nodes, apply 3D styles, and create side faces
  function traverseChildren(parentNode, depthLevel, offsetX, offsetY) {
    for (let children = parentNode.childNodes, childrenCount = children.length, i = 0; i < childrenCount; i++) {
      const childNode = children[i];
      if (1 === childNode.nodeType && !childNode.classList.contains(SIDE_FACE_CLASS)) {
        console.log('child', childNode, depthLevel);
        Object.assign(childNode.style, {
          transform: `translateZ(${DEPTH_INCREMENT}px)`,
          // position: 'relatibe',
          // backfaceVisibility: 'hidden',
          overflow: "visible",
          opacity: "1 !important",
          transformStyle: "preserve-3d",
          backgroundColor: getColorByDepth(depthLevel, 190), // Random color face while debugging
          willChange: 'transform',
        });


        let updatedOffsetX = offsetX;
        let updatedOffsetY = offsetY;
        if (childNode.offsetParent === parentNode) {
          updatedOffsetX += parentNode.offsetLeft;
          updatedOffsetY += parentNode.offsetTop;
        }
        createSideFaces(childNode, depthLevel);
        traverseChildren(childNode, depthLevel + 1, updatedOffsetX, updatedOffsetY);
      }
    }
  }

  // Apply initial styles to the body to enable 3D perspective
  const body = document.body;
  body.style.overflow = "visible";
  document.documentElement.style.transformStyle = "preserve-3d";
  body.style.transformStyle = "preserve-3d";
  // body.style.backfaceVisibility = 'hidden';
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