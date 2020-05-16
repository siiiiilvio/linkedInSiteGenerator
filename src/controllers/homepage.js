const fs = require('fs');
const scraper = require('../utils/scraper');
const target = process.env.SCRAPE_TARGET;

const homepage = async (req, res, next) => {
    const profile = fs.existsSync('profile.json')
        ? JSON.parse(fs.readFileSync('profile.json'))
        : await scraper(target);
    res.profile = profile;
    next();
};

module.exports = homepage;
