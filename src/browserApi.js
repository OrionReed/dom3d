export function getBrowser() {
    return (typeof browser !== 'undefined') ? browser : chrome;
}