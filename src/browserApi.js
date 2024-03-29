export function getBrowser() {
	// @ts-ignore
	return typeof browser !== "undefined" ? browser : chrome;
}
