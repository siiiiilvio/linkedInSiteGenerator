const puppeteer = require('puppeteer');
const memoryCache = require('memory-cache');
const parser = require('./parser');
const { cookies } = require('./constants');

const scraper = async target => {
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    const page = await browser.newPage();
    await page.setViewport({
        width: 1400,
        height: 800,
        deviceScaleFactor: 1,
    });
    await page.setCookie(...cookies);
    await page.goto(target, { waitUntil: 'networkidle2' });
    const bodyHTML = await page.evaluate(() => document.body.innerHTML);
    const profile = parser(bodyHTML);
    memoryCache.put(`__profile__`, profile);
    return profile;
};

module.exports = scraper;
