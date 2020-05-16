const express = require('express');
const homepage = require('./controllers/homepage');
const mail = require('./utils/mail');

const router = express.Router();

const renderView = (res, view, query) => {
    const profile = res.profile;
    res.status(200).render(view, { profile, query });
};

router.get('/', homepage, (req, res) => {
    const query = req.query;
    res.profile ? renderView(res, 'index', query) : res.send('Update profile');
});

router.post('/contact', async (req, res) => {
    await mail(req.body);
    res.redirect('/?message=thanks#contact');
});

module.exports = router;
