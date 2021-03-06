require('dotenv').config();
const fs = require('fs');
const puppeteer = require('puppeteer');
const parser = require('./parser');
const { cookies } = require('./constants');
const { exec } = require('child_process');
const target = process.env.SCRAPE_TARGET;

const scraper = async () => {
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
    fs.writeFileSync('profile.json', JSON.stringify(profile));
    exec('./copyProfile.sh', (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            return;
        }
        console.log(`stdout: ${stdout}`);
        process.exit(0);
    });
};

scraper();
