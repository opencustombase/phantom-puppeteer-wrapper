const puppeteer = require('puppeteer');

class WebPage {
    constructor() {
        this.browser = null;
        this.page = null;
    }

    async open(url, callback) {
        if (!this.browser) {
            this.browser = await puppeteer.launch();
        }
        this.page = await this.browser.newPage();
        const response = await this.page.goto(url);
        const status = response.ok() ? 'success' : 'fail';
        callback(status);
    }

    async evaluate(fn, ...args) {
        return await this.page.evaluate(fn, ...args);
    }

    async render(filePath) {
        await this.page.screenshot({ path: filePath });
    }

    async close() {
        if (this.browser) {
            await this.browser.close();
            this.browser = null;
        }
    }
}

module.exports = {
    webpage: {
        create: () => new WebPage()
    }
};