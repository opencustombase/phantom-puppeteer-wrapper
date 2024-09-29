# Phantom-Puppeteer-Wrapper

A drop-in replacement for PhantomJS, utilizing Puppeteer as the underlying web driver. This tool aims to mimic PhantomJS’s API, providing familiar methods while leveraging Puppeteer’s modern headless browser capabilities.

## Installation

To install the package, run:

```bash
npm install phantom-puppeteer-wrapper
```

## Features
- Create a new page
- Open a URL
- Evaluate Javascript on the page
- Take a screenshot
- Close the browser

## Usage

1. Create a Page
```javascript
const { webpage } = require('phantom-puppeteer-wrapper');
const page = webpage.create();
```
2. Open a URL
```javascript
page.open('http://example.com', (status) => {
  console.log("Page status:", status);  // 'success' or 'fail'
});
```
3. Evaluate Javascript on the page
```javascript
page.includeJs('http://ajax.googleapis.com/ajax/libs/jquery/1.6.1/jquery.min.js', async () => {
  const result = await page.evaluate(() => {
    return $(".explanation").text();
  });
  console.log('Result:', result);
  page.exit(0);  // Close browser and exit with status 0
});

const result = await page.evaluate(() => {
  return document.title;
});
console.log("Page title:", result);
```
4. Take a screenshot
```javascript
await page.render('screenshot.png');
console.log("Screenshot saved.");
```
5. Close the browser
```javascript
await page.exit(0);
console.log("Browser closed.");
```

Testing

We provide built-in tests that utilize a local mock server to validate the functionality.

To run the tests:

```bash
npm test
```