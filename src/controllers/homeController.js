const router = require('express').Router();
const cryptoService = require('../services/cryptoService');
const { getErrorMessage } = require('../util');

router.get('/', (req, res) => {
    res.render('home');
});

router.get('/search', async (req, res) => {
    try {
        const matches = await cryptoService.getAll().lean();
        res.render('home/search', { matches });
    } catch (error) {
        res.redirect('home/404');
    }
});

router.post('/search', async (req, res) => {
    const { name, payment } = req.body;
    try {
        const matches = await cryptoService.search(name, payment).lean();
        res.render('home/search', { matches, name, payment });
    } catch (error) {
        res.render('home/search', { ...req.body, error: getErrorMessage(error) });
    }
});

module.exports = router;
