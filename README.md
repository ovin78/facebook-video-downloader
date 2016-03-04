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

**TL;DR:** Find `embed` elements that are descendants of `video` elements and parse its `flashvars` to extract its SD and/or HD source URLs.

### Detailed version

The content script creates a mutation observer on every Facebook page and listens to changes to every DOM node's subtree. Whenever a change to the subtree is detected, it scans the document for any new `embed` elements. If such an element represents a Facebook video, it will have a `flashvars` attribute which contains information about the video's SD and/or HD video URLs. If those URLs can be found, we extract them and insert download links over the video.

## Building

Requirements: [Webpack](https://webpack.github.io), [npm](https://www.npmjs.com)

    $ cd facebook-video-downloader
    $ npm install
    $ webpack -p

The `-p` flag tells Webpack to minify the output. Feel free to omit it.

## Developing

During development, I usually just use `webpack -vw` (verbose output + watch files for changes). When using file watching, the first build will take some time (~1 minute on my computer), but the subsequent ones will be very fast.

### Gotchas

Remember that paths referenced in e.g. manifest.json are relative to manifest.json *in the dist directory*.

### Code style guidelines

#### JavaScript

1. Use tabs for indentation, except for in package.json (since NPM uses spaces)
1. Use semicolons after statements
1. Declare only one variable per statement (i.e. not `var x, y, z`)
1. Prefer `let` to `var`
1. Prefer 'apostrophes' to "quotation marks"
1. Prefer \`template strings\` to 'string con' + 'catenation'

#### HTML

1. Prefer "quotation" marks to 'apostrophes' for attribute values

#### Stylesheets

1. Make it maintainable
1. That's it
