const router = require('express').Router();
const cryptoService = require('../services/cryptoService');

const { isAuthenticated } = require('../middlewares/authMid');
const { getErrorMessage } = require('../util');

router.get('/', (req, res) => {
    res.render('crypto/catalog');
});

router.get('/create', (req, res) => {
    res.render('crypto/create');
});

router.post('/create', isAuthenticated, async (req, res) => {
    try {
        await cryptoService.create({ ...req.body, owner: req.user._id });

        res.redirect('/crypto');
    } catch (error) {
        res.render('crypto/create', { ...req.body, error: getErrorMessage(error) });
    }
});

module.exports = router;
