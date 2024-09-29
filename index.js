const puppeteer = require('puppeteer');

class PhantomPuppeteer {
  constructor() {
    this.browser = null;
    this.page = null;
  }

  async createPage() {
    if (!this.browser) {
      this.browser = await puppeteer.launch();
    }
    this.page = await this.browser.newPage();
    return this.page;
  }

  async open(url, callback) {
    if (!this.page) {
      await this.createPage();
    }
    const response = await this.page.goto(url);
    const status = response.ok() ? 'success' : 'fail';
    callback(status);
  }

  async render(filePath) {
    if (!this.page) throw new Error('Page not created');
    await this.page.screenshot({ path: filePath });
  }

  async evaluate(fn, ...args) {
    if (!this.page) throw new Error('Page not created');
    return await this.page.evaluate(fn, ...args);
  }

  async close() {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }
}

module.exports = new PhantomPuppeteer();