import { getBrowser } from "./browserApi.js";
import { dom3d } from "./dom3d.js";
let enabled = false;

// browser extension state
let showSides = false;
let colorSurfaces = true;
let colorRandom = false;
let zoomEnabled = true;
let requireDragEnabled = false;
const browser = getBrowser();

// Create context menu items for user preferences
const options = [
	{
		id: "toggle-show-sides",
		title: "Show Sides",
		type: "checkbox",
		checked: showSides,
		contexts: ["action"],
	},
	{
		id: "toggle-color-surfaces",
		title: "Show Surfaces",
		type: "checkbox",
		checked: colorSurfaces,
		contexts: ["action"],
	},
	{
		id: "toggle-color-random",
		title: "Randomize Color",
		type: "checkbox",
		checked: colorRandom,
		contexts: ["action"],
	},
	{
		id: "toggle-zoom",
		title: "Enable Zoom",
		type: "checkbox",
		checked: zoomEnabled,
		contexts: ["action"],
	},
	{
		id: "toggle-require-drag",
		title: "Require Drag",
		type: "checkbox",
		checked: requireDragEnabled,
		contexts: ["action"],
	},
];

for (const opt of options) {
	browser.contextMenus.create(opt);
}

browser.contextMenus.onClicked.addListener((info, tab) => {
	const optionMappings = {
		"toggle-show-sides": () => {
			showSides = !showSides;
		},
		"toggle-color-surfaces": () => {
			colorSurfaces = !colorSurfaces;
		},
		"toggle-color-random": () => {
			colorRandom = !colorRandom;
		},
		"toggle-zoom": () => {
			zoomEnabled = !zoomEnabled;
		},
		"toggle-require-drag": () => {
			requireDragEnabled = !requireDragEnabled;
		},
	};

	if (Object.prototype.hasOwnProperty.call(optionMappings, info.menuItemId)) {
		const newState = optionMappings[info.menuItemId](); // Toggle the state
		browser.contextMenus.update(info.menuItemId, { checked: newState });
	}
});

// Handle enabling/disabling the extension
browser.action.onClicked.addListener(async (tab) => {
	if (enabled) {
		enabled = false;
		browser.tabs.reload(tab.id);
		return;
	}
	try {
		await browser.scripting.executeScript({
			target: {
				tabId: tab.id,
			},
			func: dom3d,
			args: [
				showSides,
				colorSurfaces,
				colorRandom,
				zoomEnabled,
				requireDragEnabled,
			],
		});
		enabled = true;
	} catch (err) {
		console.error(`failed to execute script: ${err}`);
	}
});
