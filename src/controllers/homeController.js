const router = require('express').Router();
const cryptoService = require('../services/cryptoService');

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
        res.render('home/search', { matches });
    } catch (error) {
        res.redirect('home/404');
    }
});

module.exports = router;
