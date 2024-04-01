import { getBrowser } from "./browserApi.js";
import { dom3d } from "./dom3d.js";

// browser extension state
let colorSurfaces = true;
let showSides = false;
let colorRandom = false;
let requireDrag = true;
let requireAlt = false;
let CssSelectors = [];
const browser = getBrowser();

// Create context menu items for user preferences
const options = [
	{
		id: "toggle-color-surfaces",
		title: "Show Surfaces",
		type: "checkbox",
		checked: colorSurfaces,
		contexts: ["action"],
	},
	{
		id: "toggle-show-sides",
		title: "Show Sides",
		type: "checkbox",
		checked: showSides,
		contexts: ["action"],
	},
	{
		id: "toggle-require-drag",
		title: "Require Drag",
		type: "checkbox",
		checked: requireDrag,
		contexts: ["action"],
	},
	{
		id: "toggle-require-alt",
		title: "Require Alt Key",
		type: "checkbox",
		checked: requireAlt,
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
		id: "selectors",
		title: "CSS Selectors",
		type: "normal",
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
		"toggle-require-drag": () => {
			requireDrag = !requireDrag;
		},
		"toggle-require-alt": () => {
			requireAlt = !requireAlt;
		},
		selectors: () => {
			// Inject a script to open a prompt for the user
			browser.scripting.executeScript({
				target: { tabId: tab.id },
				func: (selectors) => {
					let input = prompt("Selectors", JSON.stringify(selectors));
					const formatError =
						"Please enter a valid JSON array with objects containing a 'selector' string and a 'hue' number.";
					if (input) {
						try {
							// Convert JS objects or single-quoted strings to valid JSON
							input = input
								.replace(/(['"])?([a-zA-Z0-9_]+)(['"])?:/g, '"$2":')
								.replace(/'/g, '"');
							const parsedInput = JSON.parse(input);
							if (
								Array.isArray(parsedInput) &&
								parsedInput.every(
									(item) =>
										typeof item.selector === "string" &&
										typeof item.hue === "number",
								)
							) {
								(typeof browser !== "undefined"
									? browser
									: // @ts-ignore
										chrome
								).runtime.sendMessage({
									updatedSelectors: parsedInput,
								});
							} else {
								throw new Error(`Invalid format. ${formatError}`);
							}
						} catch (e) {
							alert(e);
							return;
						}
					}
				},
				args: [CssSelectors],
			});
		},
	};

	if (Object.prototype.hasOwnProperty.call(optionMappings, info.menuItemId)) {
		const newState = optionMappings[info.menuItemId](); // Toggle the state
		browser.contextMenus.update(info.menuItemId, { checked: newState });
	}
});

// Handle enabling/disabling the extension
browser.action.onClicked.addListener(async (tab) => {
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
				requireDrag,
				requireAlt,
				CssSelectors,
			],
		});
	} catch (err) {
		console.error(`failed to execute script: ${err}`);
	}
});

browser.runtime.onMessage.addListener((message, _, __) => {
	if (message.updatedSelectors) {
		CssSelectors = message.updatedSelectors;
	}
});
