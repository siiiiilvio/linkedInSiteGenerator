const memoryCache = require('memory-cache');
const scraper = require('../utils/scraper');
const target = process.env.SCRAPE_TARGET;

const homepage = async (req, res, next) => {
    const profile = memoryCache.get(`__profile__`) || (await scraper(target));
    res.profile = profile;
    next();
};

module.exports = homepage;
