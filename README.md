# Facebook Video Downloader

This is a Chrome extension (and Opera addon) which lets you download Facebook videos in HD or SD format.

## Installation

* [Chrome Web Store](https://chrome.google.com/webstore/detail/facebook-video-downloader/ailljefjagbgbiedgnpdahpdhfpkaadj)
* [Opera Addons](https://addons.opera.com/sv/extensions/details/facebook-video-downloader)

## Permissions

Chrome will tell you the extension needs two permissions:

1. **Read and change your data on all facebook.com sites.** (To find videos on Facebook pages and insert download buttons.)
2. **Read your browsing history.** (We do *not* scan your browser history. This is only used when the extension is installed. This is to look for previously opened Facebook tabs and to insert download buttons for any videos we find.)

## How it works

The content script creates a mutation observer for every Facebook page and listens to changes to any DOM node's children and ancestors. Whenever a change is detected, it scans the node for any new EMBED elements.

If an EMBED element is a Facebook video, it should contain a "flashvars" attribute with information about the HD and/or SD video URL. We extract those URLs using regular expressions.

## Building

Requirements: [Webpack](https://webpack.github.io), [npm](https://www.npmjs.com)

    $ cd facebook-video-downloader
    $ npm install
    $ webpack -p

The -p flag tells Webpack to minify the output. Feel free to omit it, but do use it when shipping.

## Developing

During development, I usually just use `webpack -vw` (verbose output + watch files for changes). When using file watching, the first build will take some time (~1 minute on my computer), but the subsequent ones will be very fast.

### Gotchas

Remember that paths referenced in e.g. manifest.json are relative to manifest.json *in the dist directory*.

## Code style guidelines

### JavaScript

1. Use tabs for indentation, except for in package.json (since npm uses spaces)
1. Use one semicolon after statements
1. Declare only one variable per statement
1. Prefer `let` to `var`, unless the latter is required
1. Prefer 'apostrophes' to "quotation marks" in JavaScript
1. Prefer "quotation" marks to 'apostrophes' in HTML
1. Prefer ES6 \`template strings\` to 'string con' + 'catenation'

### Sass/CSS

1. Make it maintainable
1. That's it
