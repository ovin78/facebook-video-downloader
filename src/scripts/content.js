'use strict'

import '../styles/content.scss'

// data attribute and value to attach to elements that have been handled
const DATA_ATTRIBUTE = 'fbvddwnldr'
const DATA_VALUE = '1'

// regexps to extract HD/SD sources from flashvars
const HD_REGEXP = new RegExp('"hd_src_no_ratelimit":"([^"]+)"')
const SD_REGEXP = new RegExp('"sd_src_no_ratelimit":"([^"]+)"')

// matches a literal "\/" anywhere in a string
const SLASH_REGEXP = new RegExp('\\\\/', 'g')

// unicode floppy disk
const FLOPPY = '\ud83d\udcbe'

// extracts the HD and/or SD sources from a flashvars attribute value
function extractSources(flashvars) {

	// match `input` and `regexp` and replace all "\/" with just "/".
	function extractURL(input, regexp) {
		let m = input.match(regexp)
		return m ? m[1].replace(SLASH_REGEXP, '/') : null
	}

	// decode the URI encoded
	let value = decodeURIComponent(flashvars)
	let hd = extractURL(value, HD_REGEXP)
	let sd = extractURL(value, SD_REGEXP)

	return {
		hd,
		sd
	}
}

// inserts the download buttons given the target node and the HD/SD sources
function insertButtons(node, sources) {
	if (!sources.hd && !sources.sd)
		return
	let html = '<p class="fbvd--wrapper">'
	if (sources.hd)
		html += `<a download target="_blank" href="${sources.hd}"><b>${FLOPPY}</b> HD</a>`
	if (sources.sd)
		html += `<a download target="_blank" href="${sources.sd}"><b>${FLOPPY}</b> SD</a>`
	html += '</p>'
	node.insertAdjacentHTML('beforebegin', html)
}

// * find video source URLs for the given embed element
// * insert download buttons next to the element
// * if the embed element is a grandchild of a video element,
//   insert the buttons  next to the video element instead
function handleEmbed(node) {
	node.dataset[DATA_ATTRIBUTE] = '1' // mark the node as handled
	let flashvars = node.getAttribute('flashvars')
	if (!flashvars)
		return
	let sources = extractSources(flashvars)
	let grandParent = node.parentNode.parentNode
	let target = grandParent.nodeName == 'VIDEO' ? grandParent : node
	insertButtons(target, sources)
	return node
}

// find all unhandled embed elements under `node`
function handleDescendantsOf(node) {
	let nodeList = node.querySelectorAll(`embed:not([data-${DATA_ATTRIBUTE}="1"])`)
	let result = Array.from(nodeList, node => {
		return handleEmbed(node)
	})
}

// create an observer instance
// find any embed elements below nodes that change
let observer = new MutationObserver(mutations => {
	mutations.forEach(rec =>
		handleDescendantsOf(rec.target)
	)
})

// start observing immediately
observer.observe(document, {
	childList: true, // listen to changes to node children
	subtree: true // listen to changes to descendants as well
})

// update whenever the background scripts asks for it
chrome.runtime.onMessage.addListener((request, sender, response) => {
	if (request.msg == 'update')
		handleDescendantsOf(document)
})
