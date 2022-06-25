const router = require('express').Router();
const cryptoService = require('../services/cryptoService');

const { isAuthenticated } = require('../middlewares/authMid');
const { getErrorMessage } = require('../util');

router.get('/', async (req, res) => {
    try {
        const cryptos = await cryptoService.getAll().lean();

        res.render('crypto/catalog', { cryptos });
    } catch (error) {
        res.render('home/404');
    }
});

router.get('/details/:cryptoId', async (req, res) => {
    try {
        const crypto = await cryptoService.getOne(req.params.cryptoId).lean();

        const isOwner = crypto.owner._id == req.user?._id;

        res.render('crypto/details', { ...crypto, isOwner });
    } catch (error) {
        res.render('home/404');
    }
});

router.get('/create', isAuthenticated, (req, res) => {
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

router.get('/edit/:cryptoId', isAuthenticated, async (req, res) => {
    try {
        const crypto = await cryptoService.getOne(req.params.cryptoId).lean();

        res.render('crypto/edit', { ...crypto });
    } catch (error) {
        res.render('crypto/edit', { error: getErrorMessage(error) });
    }
});

router.post('/edit/:cryptoId', isAuthenticated, async (req, res) => {
    const crypto = await cryptoService.getOne(req.params.cryptoId).lean();

    try {
        const isOwner = crypto.owner._id == req.user?._id;
        if (!isOwner) {
            throw {
                message: 'Not an owner!',
            };
        }

        await cryptoService.edit(req.params.cryptoId, req.body);

        res.redirect(`/crypto/details/${crypto._id}`);
    } catch (error) {
        res.render('crypto/edit', { ...crypto, error: getErrorMessage(error) });
    }
});

router.get('/delete/:cryptoId', isAuthenticated, (req, res) => {
    res.render('crypto/create');
});

module.exports = router;
