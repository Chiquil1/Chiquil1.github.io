"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchApi = fetchApi;
exports.fetchProto = fetchProto;
exports.fetchText = fetchText;
async function fetchApi(url, options) {
    const response = await fetch(url, options);
    if (!response.ok)
        throw new Error(`API request failed: ${response.statusText}`);
    return response.json();
}
async function fetchProto(url, options) {
    const response = await fetch(url, options);
    if (!response.ok)
        throw new Error(`Proto request failed: ${response.statusText}`);
    return response.arrayBuffer();
}
async function fetchText(url, options) {
    const response = await fetch(url, options);
    if (!response.ok)
        throw new Error(`Text request failed: ${response.statusText}`);
    return response.text();
}
