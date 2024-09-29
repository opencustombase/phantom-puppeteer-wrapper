const http = require('http');

let server;

beforeAll((done) => {
  server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end('<html><head><title>Mock Server</title></head><body><h1>Hello from Mock Server</h1></body></html>');
  });
  server.listen(8080, done);
});

const phantom = require('../index');
console.log('phantom class ---> ', phantom);
describe('PhantomPuppeteer with Mock Server', () => {
  beforeAll(async () => {
    await phantom.createPage();
  });

  afterAll(async () => {
    server.close();
    await phantom.close();
  });

  test('open a mock page and return success', (done) => {
    phantom.open('http://localhost:8080', (status) => {
      expect(status).toBe('success');
      done();
    });
  });

  test('evaluate JS on the mock page', async () => {
    const title = await phantom.evaluate(() => document.title);
    expect(title).toBe('Mock Server');
  });
});