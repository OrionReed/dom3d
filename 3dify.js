(function () {
  const MAX_ROTATION = 180;
  const DEPTH_INCREMENT = 20;
  const PERSPECTIVE = 5000;
  const Z_INCREMENT_SCALE = 0.001;

  function traverseChildren(parentNode, depthLevel, offsetX, offsetY) {
    for (let children = parentNode.childNodes, childrenCount = children.length, i = 0; i < childrenCount; i++) {
      const childNode = children[i];
      if (1 === childNode.nodeType) {
        childNode.style.overflow = "visible";
        childNode.style.transformStyle = "preserve-3d";
        childNode.style.transform = `translateZ(${DEPTH_INCREMENT + (childrenCount - offsetY) * Z_INCREMENT_SCALE}px)`;
        childNode.offsetParent === parentNode && (offsetX += parentNode.offsetLeft, offsetY += parentNode.offsetTop);
        traverseChildren(childNode, depthLevel + 1, offsetX, offsetY);
      }
    }
  }

  const body = document.body;
  body.style.overflow = "visible";
  body.style.transformStyle = "preserve-3d";
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