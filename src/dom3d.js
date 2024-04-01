// Main function invoked on browser action click
export function dom3d(
	SHOW_SIDES,
	COLOR_SURFACE,
	COLOR_RANDOM,
	REQUIRE_DRAG,
	REQUIRE_ALT,
	SELECTORS,
) {
	const body = document.body;
	if (body.classList.contains("dom3d-enabled")) return;
	body.classList.add("dom3d-enabled");

	const DEFAULT_HUE = 190;
	const MAX_ROTATION = 180; // set to 360 to rotate all the way round
	const THICKNESS = 20; // thickness of layers
	const PERSPECTIVE = 1000; // akin to FOV

	const state = {
		rotationX: 0,
		rotationY: 0,
		zoomLevel: 1,
		isDragging: false,
		startX: 0,
		startY: 0,
		startRotationX: 0,
		startRotationY: 0,
	};
	const domDepthCache = getDOMDepth(document.body);

	// Apply initial styles to the body to enable 3D perspective
	applyBaseBodyStyles();
	addEventListeners();
	traverseDOM(document.body, 0, 0, 0);

	// Recursive function to traverse child nodes, apply 3D styles, and create side faces
	function traverseDOM(parentNode, depthLevel, offsetX, offsetY) {
		for (
			let children = parentNode.children,
				childrenCount = children.length,
				i = 0;
			i < childrenCount;
			i++
		) {
			const node = children[i];
			if (node.classList.contains("dom3d-side-face")) continue;

			// Set the color based on the selector or default hue
			const hueSelector = SELECTORS.find((hue) => node.matches(hue.selector));
			const hue = hueSelector ? hueSelector.hue : DEFAULT_HUE;
			const color = COLOR_RANDOM
				? getRandomColor()
				: getColorByDepth(depthLevel, hue, -5);

			// Apply the styles to the child node
			Object.assign(node.style, {
				transform: `translateZ(${THICKNESS}px)`,
				overflow: "visible",
				transformStyle: "preserve-3d",
				backgroundColor: COLOR_SURFACE
					? color
					: getComputedStyle(node).backgroundColor,
				willChange: "transform",
				isolation: "auto",
			});

			let updatedOffsetX = offsetX;
			let updatedOffsetY = offsetY;
			if (node.offsetParent === parentNode) {
				updatedOffsetX += parentNode.offsetLeft;
				updatedOffsetY += parentNode.offsetTop;
			}
			createSideFaces(node, color);
			traverseDOM(node, depthLevel + 1, updatedOffsetX, updatedOffsetY);
		}
	}

	// Create side faces for an element to give it a 3D appearance
	function createSideFaces(element, color) {
		if (!SHOW_SIDES) return;

		const width = element.offsetWidth;
		const height = element.offsetHeight;
		const fragment = document.createDocumentFragment();

		// Helper function to create and style a face
		const createFace = ({
			width,
			height,
			transform,
			transformOrigin,
			left,
			top = "",
			bottom = "",
		}) => {
			const face = document.createElement("div");
			face.className = "dom3d-side-face";
			Object.assign(face.style, {
				transformStyle: "preserve-3d",
				backfaceVisibility: "hidden",
				position: "absolute",
				width: `${width}px`,
				height: `${height}px`,
				background: color,
				transform,
				transformOrigin,
				overflow: "hidden",
				willChange: "transform",
				top,
				left,
				bottom,
			});
			fragment.appendChild(face);
		};

		// Top face
		createFace({
			width,
			height: THICKNESS,
			transform: `rotateX(-270deg) translateY(${-THICKNESS}px)`,
			transformOrigin: "top",
			top: "0px",
			left: "0px",
		});

		// Right face
		createFace({
			width: THICKNESS,
			height,
			transform: "rotateY(90deg)",
			transformOrigin: "left",
			top: "0px",
			left: `${width}px`,
		});

		// Bottom face
		createFace({
			width,
			height: THICKNESS,
			transform: `rotateX(-90deg) translateY(${THICKNESS}px)`,
			transformOrigin: "bottom",
			bottom: "0px",
			left: "0px",
		});

		// Left face
		createFace({
			width: THICKNESS,
			height,
			transform: `translateX(${-THICKNESS}px) rotateY(-90deg)`,
			transformOrigin: "right",
			top: "0px",
			left: "0px",
		});

		element.appendChild(fragment);
	}

	// UTILS —————————————————————————————————————————————————————

	function getRandomColor() {
		const hue = Math.floor(Math.random() * 360);
		const saturation = 40 + Math.floor(Math.random() * 30);
		const lightness = 30 + Math.floor(Math.random() * 30);
		return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
	}

	function getBodyTransform() {
		return `rotateX(${state.rotationY}deg) rotateY(${state.rotationX}deg) scale(${state.zoomLevel})`;
	}
	function getDOMDepth(element) {
		return (
			[...element.children].reduce(
				(max, child) => Math.max(max, getDOMDepth(child)),
				0,
			) + 1
		);
	}
	function getColorByDepth(depth, hue = 0, lighten = 0) {
		return `hsl(${hue}, 75%, ${
			Math.min(10 + depth * (1 + 60 / domDepthCache), 90) + lighten
		}%)`;
	}

	function applyBaseBodyStyles() {
		const html = document.documentElement;
		const perspectiveOriginX = window.innerWidth / 2;
		const perspectiveOriginY = window.innerHeight / 2;
		html.style.background = body.style.background;
		body.style.overflow = "visible";
		body.style.transformStyle = "preserve-3d";
		body.style.perspective = `${PERSPECTIVE}`;
		body.style.perspectiveOrigin =
			body.style.transformOrigin = `${perspectiveOriginX}px ${perspectiveOriginY}px`;
	}

	// EVENT LISTENERS ——————————————————————————————————————————

	function handlePointerDown(event) {
		if (REQUIRE_ALT && !event.altKey) return;
		state.isDragging = true;
		state.startX = event.clientX;
		state.startY = event.clientY;
		state.startRotationX = state.rotationX;
		state.startRotationY = state.rotationY;
		event.preventDefault(); // Prevent default actions like text selection
	}

	function handleWheel(event) {
		event.preventDefault();
		state.zoomLevel = Math.max(
			0.1,
			Math.min(state.zoomLevel + event.deltaY * 0.001, 2),
		);
		body.style.transform = getBodyTransform();
	}

	function handlePointerMove(event) {
		if (REQUIRE_DRAG && !state.isDragging) return;
		if (REQUIRE_ALT && !event.altKey) return;

		if (REQUIRE_DRAG) {
			// Drag-based rotation/orbiting
			const deltaX = event.clientX - state.startX;
			const deltaY = event.clientY - state.startY;

			state.rotationX =
				state.startRotationX + (MAX_ROTATION * deltaX) / window.innerWidth;
			state.rotationY =
				state.startRotationY - (MAX_ROTATION * deltaY) / window.innerHeight;
		} else {
			state.rotationY =
				MAX_ROTATION * (1 - event.clientY / window.innerHeight) -
				MAX_ROTATION / 2;
			state.rotationX =
				(MAX_ROTATION * event.clientX) / window.innerWidth - MAX_ROTATION / 2;
		}

		// Update the DOM transformation
		body.style.transform = getBodyTransform();
	}

	function addEventListeners() {
		document.addEventListener("pointermove", handlePointerMove);
		document.addEventListener("wheel", handleWheel, { passive: false });
		document.addEventListener("pointerup", () => {
			state.isDragging = false;
		});
		document.addEventListener("pointerdown", handlePointerDown, {
			passive: false,
		});
	}
}
