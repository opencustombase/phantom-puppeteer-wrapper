const { webpage } = require('../index');
const http = require('http');

let server;
let pageInstance;

beforeAll((done) => {
    server = http.createServer((req, res) => {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end('<html><head><title>Mock Server</title></head><body><h1>Hello from Mock Server</h1></body></html>');
    });
    server.listen(8080, done);
});

afterAll((done) => {
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

    test('render a screenshot', async () => {
        await pageInstance.render('mock_screenshot.png');
        const fs = require('fs');
        const fileExists = fs.existsSync('mock_screenshot.png');
        expect(fileExists).toBe(true);
    });

    test('close the browser', async () => {
        await pageInstance.close();
        expect(pageInstance.browser).toBe(null);
    });
});