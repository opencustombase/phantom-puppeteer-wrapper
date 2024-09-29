const { webpage } = require('../index');
const http = require('http');

let server;
let pageInstance;

beforeAll((done) => {
  jest.spyOn(process, 'exit').mockImplementation(() => {});
  server = http.createServer((req, res) => {
    if (req.url === '/test-script.js') {
      res.writeHead(200, { 'Content-Type': 'application/javascript' });
      res.end('window.testFunction = function() { return "Local JS Loaded"; };');
    } else {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end('<html><head><title>Mock Server</title><div class="explanation">Test Explanation</div></head></body></html>');
    }
  });
  server.listen(8080, done);
});

afterAll((done) => {
  process.exit.mockRestore();
  server.close(done);
});

describe('PhantomPuppeteer Wrapper (PhantomJS-like)', () => {
  beforeAll(async () => {
    pageInstance = webpage.create();
  });

  test('open a mock page and return success', (done) => {
    pageInstance.open('http://localhost:8080', (status) => {
      expect(status).toBe('success');
      done();
    });
  });

  test('evaluate JS on the mock page', async () => {
    const title = await pageInstance.evaluate(() => document.title);
    expect(title).toBe('Mock Server');
  });

  test('include local JS and evaluate', (done) => {
    pageInstance.includeJs('http://localhost:8080/test-script.js', async () => {
      const result = await pageInstance.evaluate(() => {
        return window.testFunction();
      });
      expect(result).toBe('Local JS Loaded');
      done();
    });
  });

  test('render a screenshot', async () => {
    await pageInstance.render('mock_screenshot.png');
    const fs = require('fs');
    const fileExists = fs.existsSync('mock_screenshot.png');
    expect(fileExists).toBe(true);
  });

  test('exit the browser', async () => {
    await pageInstance.exit(0);
    expect(pageInstance.browser.isConnected()).toBe(false);
  });
});