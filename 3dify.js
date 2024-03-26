((depthIncrement, perspective) => {
  const MAX_ROTATION = 180;

  function generate3DStyleDiv(xPos, yPos, zPos, width, height, rotationY, bgColor) {
    return "<div style='position:absolute;-webkit-transform-origin: 0 0 0;'" +
      ("background:" + bgColor + ";") +
      ("width:" + width + "px; height:" + height + "px;") +
      ("-webkit-transform:" +
        ("translate3d(" + xPos + "px," + yPos + "px," + zPos + "px)") +
        ("rotateX(270deg) rotateY(" + rotationY + "deg)") +
        ";") +
      "'></div>"
  }

  function apply3DTransforms(parentNode, depthLevel, offsetX, offsetY) {
    for (let children = parentNode.childNodes, childrenCount = children.length, i = 0; i < childrenCount; i++) {
      let childNode = children[i];
      if (1 === childNode.nodeType) {
        childNode.style.overflow = "visible";
        childNode.style.WebkitTransformStyle = "preserve-3d";
        childNode.style.WebkitTransform = "translateZ(" + (depthIncrement + (childrenCount - offsetY) * zIncrement).toFixed(3) + "px)";

        childNode.offsetParent === parentNode && (offsetX += parentNode.offsetLeft, offsetY += parentNode.offsetTop);
        apply3DTransforms(childNode, depthLevel + 1, offsetX, offsetY);
        generatedDivsHTML += generate3DStyleDiv(offsetX + childNode.offsetLeft, offsetY + childNode.offsetTop, (depthLevel + 1) * depthIncrement, childNode.offsetWidth, depthIncrement, 0, colors[depthLevel % (colors.length - 1)]);
        generatedDivsHTML += generate3DStyleDiv(offsetX + childNode.offsetLeft + childNode.offsetWidth, offsetY + childNode.offsetTop, (depthLevel + 1) * depthIncrement, childNode.offsetHeight, depthIncrement, 270, colors[depthLevel % (colors.length - 1)]);
        generatedDivsHTML += generate3DStyleDiv(offsetX + childNode.offsetLeft, offsetY + childNode.offsetTop + childNode.offsetHeight, (depthLevel + 1) * depthIncrement, childNode.offsetWidth, depthIncrement, 0, colors[depthLevel % (colors.length - 1)]);
        generatedDivsHTML += generate3DStyleDiv(offsetX + childNode.offsetLeft, offsetY + childNode.offsetTop, (depthLevel + 1) * depthIncrement, childNode.offsetHeight, depthIncrement, 270, colors[depthLevel % (colors.length - 1)])
      }
    }
  }
  let colors = ["#C33", "#ea4c88", "#663399", "#0066cc", "#669900", "#ffcc33", "#ff9900", "#996633"];
  let zIncrement = 0.001;
  let generatedDivsHTML = "";
  let doc = document.body;
  doc.style.overflow = "visible";
  doc.style.WebkitTransformStyle = "preserve-3d";
  doc.style.WebkitPerspective = perspective;
  let perspectiveOriginX = (window.innerWidth / 2).toFixed(2);
  let perspectiveOriginY = (window.innerHeight / 2).toFixed(2);
  doc.style.WebkitPerspectiveOrigin = doc.style.WebkitTransformOrigin = perspectiveOriginX + "px " + perspectiveOriginY + "px";
  apply3DTransforms(doc, 0, 0, 0);
  let hiddenDiv = document.createElement("DIV");
  hiddenDiv.style.display = "none";
  hiddenDiv.style.position = "absolute";
  hiddenDiv.style.top = 0;
  hiddenDiv.innerHTML = generatedDivsHTML;
  doc.appendChild(hiddenDiv);
  let interactionState = "FACES";
  document.addEventListener("mousemove", (b) => {
    if ("DISABLED" !== interactionState) {
      let rotationY = (MAX_ROTATION * (1 - b.screenY / screen.height) - (MAX_ROTATION / 2)).toFixed(2);
      let rotationX = (MAX_ROTATION * b.screenX / screen.width - (MAX_ROTATION / 2)).toFixed(2);
      doc.style.WebkitTransform = "rotateX(" + rotationY + "deg) rotateY(" + rotationX + "deg)";
    }
  }, !0);

  window.addEventListener("mouseup", () => {
    interactionState = interactionState === "NO_FACES" ? "FACES" : "NO_FACES";
    hiddenDiv.style.display = interactionState === "FACES" ? "" : "none";
  }, !0)
})(25, 5E3)