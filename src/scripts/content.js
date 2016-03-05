'use strict';

import '../styles/content.scss';

// data attribute and value to attach to elements that have been handled
const HANDLED_ATTRIBUTE = 'fbvddwnldr';
const HANDLED_VALUE = '1';

// regexps to extract HD/SD sources from flashvars
const HD_REGEXP = new RegExp('"hd_src_no_ratelimit":"([^"]+)"');
const SD_REGEXP = new RegExp('"sd_src_no_ratelimit":"([^"]+)"');

// matches a literal `\/` anywhere in a string
const SLASH_REGEXP = new RegExp('\\\\/', 'g');

// unicode floppy disk
const FLOPPY = '\ud83d\udcbe';

/**
 * Extract video source URLs given a flashvars attribute value.
 *
 * The HD and SD video source URLs are inserted under the 'hd' and 'sd'
 * properties in the returned object. Both can be null if the video source URL
 * was not found.
 *
 * @param  {string} flashvars - A flashvars attribute value
 * @return {object} An object with properties 'hd' and 'sd'
 */
function extractSources(flashvars) {

	// match `input` and `regexp` and replace all `\/` with just `/`
	function extractURL(input, regexp) {
		let m = input.match(regexp);
		return m ? m[1].replace(SLASH_REGEXP, '/') : null;
	}

	// decode the URI encoded value
	let value = decodeURIComponent(flashvars);
	let hd = extractURL(value, HD_REGEXP);
	let sd = extractURL(value, SD_REGEXP);

	return {
		hd,
		sd
	};
}

/**
 * Insert download buttons adjacent to a node.
 *
 * If there is no HD or SD source URL, stop. Otherwise, create and insert one
 * download button for each source URL adjacent to the node.
 *
 * @param {Node} node - A node representing a video
 * @param {object} An object containing the extracted video source URLs
 */
function insertButtons(node, sources) {
	if (!sources.hd && !sources.sd)
		return;
	let html = '<p class="fbvd--wrapper">';
	if (sources.hd)
		html += `<a download target="_blank" href="${sources.hd}"><b>${FLOPPY}</b> HD</a>`;
	if (sources.sd)
		html += `<a download target="_blank" href="${sources.sd}"><b>${FLOPPY}</b> SD</a>`;
	html += '</p>';
	node.insertAdjacentHTML('beforebegin', html);
}

/**
 * Insert download buttons in the appopriate place for the given EMBED node.
 *
 * Marks the given node as handled.
 *
 * If the given node has a `flashvars` attribute, try to extract the video
 * source URLs from its value. Otherwise, stop.
 *
 * If the node's grand-parent node is a VIDEO node, insert download buttons
 * next to that, otherwise insert them next to the EMBED node.
 *
 * @param {Node} node - An EMBED node representing a video
 */
function handleEmbed(node) {
	node.dataset[HANDLED_ATTRIBUTE] = HANDLED_VALUE; // mark the node as handled
	let flashvars = node.getAttribute('flashvars');
	if (!flashvars)
		return;
	let sources = extractSources(flashvars);
	let grandParent = node.parentNode.parentNode;
	let target = grandParent.nodeName == 'VIDEO' ? grandParent : node;
	insertButtons(target, sources);
}

/**
 * Find and handle unhandled EMBED node under a given node.
 *
 * @param {Node} node - The root node to search from
 */
function handleDescendantsOf(node) {
	let nodeList = node.querySelectorAll(`embed:not([data-${HANDLED_ATTRIBUTE}="${HANDLED_VALUE}"])`);
	Array.from(nodeList, node => {
		handleEmbed(node);
	});
}

// create an observer instance
// find any embed nodes below any node whose subtree changes
let observer = new MutationObserver(mutations => {
	mutations.forEach(rec =>
		handleDescendantsOf(rec.target)
	);
});

// start observing immediately
observer.observe(document, {
	childList: true, // listen to changes to node children
	subtree: true // listen to changes to descendants as well
});

/**
 * Undo anything we have done to the document.
 *
 * This is used for rare cases where a Facebook tab is already open while the
 * user updates the extension and the update is not compatible with the old
 * version.
 */
function clearHandled() {
	let nodeList = document.querySelectorAll(`embed[data-${HANDLED_ATTRIBUTE}="${HANDLED_VALUE}"]`);
	Array.from(nodeList, node => {
		delete node.dataset[HANDLED_ATTRIBUTE];
	});

	let wrappers = document.querySelectorAll('.fbvd--wrapper');
	Array.from(wrappers, w =>
		w.parentNode.removeChild(w)
	);
}

// update whenever the background scripts asks for it
chrome.runtime.onMessage.addListener((request, sender, response) => {
	if (request.msg == 'update') {
		clearHandled();
		handleDescendantsOf(document);
	}
});
