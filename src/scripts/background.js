'use strict';

// inject the content script into all fully loaded facebook tabs
chrome.tabs.query({
	'status': 'complete'
}, function(tabs) {
	tabs.forEach(function(tab) {
		// check if it's a facebook tab
		if (!tab.url.match(/^https?\:\/\/[^./]*\.facebook\.com/i))
			return;

		// inject the content script
		// then send the 'update' message to have it scan the page
		chrome.tabs.executeScript(tab.id, { // inject JS
			file: 'scripts/content.js',
			runAt: 'document_end'
		}, function() {
			chrome.tabs.sendMessage(tab.id, { // tell to update
				msg: 'update'
			});
		});
	});
});
