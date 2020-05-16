const scraper = require('../utils/scraper');
const target = process.env.SCRAPE_TARGET;

const update = async (req, res, next) => {
    const profile = await scraper(target);
    res.profile = profile;
    next();
};

module.exports = update;
