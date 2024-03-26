(function () {
  const MAX_ROTATION = 180;
  const DEPTH_INCREMENT = 20;
  const PERSPECTIVE = 1000;
  const Z_INCREMENT_SCALE = 0.001;
  const SIDE_FACE_CLASS = 'side-face'; // Unique class for side faces

  function getColorByDepth(depthLevel) {
    // Adjusted function to calculate color based on depthLevel
    // Lightness increases with depthLevel to make higher elements lighter
    const lightness = Math.min(20 + depthLevel, 80); // Ensure lightness is between 20 and 100
    return `hsl(240, 100%, ${lightness}%)`; // Blue color with varying lightness
  }

  function createSideFaces(element, depthLevel) {
    const depth = DEPTH_INCREMENT;
    const width = element.offsetWidth;
    const height = element.offsetHeight;
    const color = getColorByDepth(depthLevel);

    // Side faces positions and transformations
    const faces = [
      `rotateY(90deg) translateZ(${width / 2}px) translateX(${width / 2}px)`,
      `rotateY(-90deg) translateZ(${width / 2}px) translateX(-${width / 2}px)`,
      `rotateX(90deg) translateZ(${height / 2}px) translateY(-${height / 2}px)`,
      `rotateX(-90deg) translateZ(${height / 2}px) translateY(${height / 2}px)`
    ];

    faces.forEach(transform => {
      const face = document.createElement('div');
      face.className = SIDE_FACE_CLASS; // Assign the unique class
      face.style.transformStyle = "preserve-3d";
      face.style.position = 'absolute';
      face.style.width = `${width}px`;
      face.style.height = `${height}px`;
      face.style.background = color; // Use color based on depthLevel
      face.style.transform = transform;
      face.style.overflow = 'hidden';
      face.style.backfaceVisibility = 'hidden'; // Hide back face
      element.appendChild(face);
    });
  }

  function getEffectiveBackgroundColor(element) {
    let color = 'rgba(0, 0, 0, 0)'; // Default to fully transparent
    let currentElement = element;

    while (currentElement) {
      const style = window.getComputedStyle(currentElement);
      const backgroundColor = style.backgroundColor;
      // Check if the color is not transparent
      if (backgroundColor !== 'rgba(0, 0, 0, 0)' && backgroundColor !== 'transparent') {
        color = backgroundColor;
        break;
      }
      currentElement = currentElement.parentElement;
    }

    return color;
  }

  function traverseChildren(parentNode, depthLevel, offsetX, offsetY) {
    for (let children = parentNode.childNodes, childrenCount = children.length, i = 0; i < childrenCount; i++) {
      const childNode = children[i];
      if (1 === childNode.nodeType && !childNode.classList.contains(SIDE_FACE_CLASS)) { // Skip side faces
        childNode.style.position = 'relative';
        childNode.style.backfaceVisibility = 'hidden';
        childNode.style.overflow = "visible";
        childNode.style.transformStyle = "preserve-3d";
        childNode.style.transform = `translateZ(${DEPTH_INCREMENT + (childrenCount - offsetY) * Z_INCREMENT_SCALE}px)`;
        // Color face, maybe temp, need everything solid...
        childNode.style.backgroundColor = `#${Math.floor(Math.random() * 16777215).toString(16)}`;

        childNode.offsetParent === parentNode && (offsetX += parentNode.offsetLeft, offsetY += parentNode.offsetTop);
        createSideFaces(childNode, depthLevel); // Add side faces to this element
        traverseChildren(childNode, depthLevel + 1, offsetX, offsetY);
      }
    }
  }

  const body = document.body;
  body.style.overflow = "visible";
  body.style.transformStyle = "preserve-3d";
  body.style.backfaceVisibility = 'hidden';
  body.style.perspective = PERSPECTIVE;
  const perspectiveOriginX = (window.innerWidth / 2);
  const perspectiveOriginY = (window.innerHeight / 2);
  body.style.perspectiveOrigin = body.style.transformOrigin = `${perspectiveOriginX}px ${perspectiveOriginY}px`;
  traverseChildren(body, 0, 0, 0);

  document.addEventListener("mousemove", (event) => {
    const rotationY = (MAX_ROTATION * (1 - event.screenY / screen.height) - (MAX_ROTATION / 2));
    const rotationX = (MAX_ROTATION * event.screenX / screen.width - (MAX_ROTATION / 2));
    body.style.transform = `rotateX(${rotationY}deg) rotateY(${rotationX}deg)`;
  });
})()