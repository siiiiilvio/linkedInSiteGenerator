const fs = require('fs');

const homepage = async (req, res, next) => {
    let profile;
    try {
        profile = JSON.parse(fs.readFileSync('profile.json'));
    } catch (error) {
        console.log('Error: ', error);
    }
    res.profile = profile;
    next();
};

module.exports = homepage;
