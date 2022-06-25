const router = require('express').Router();
const cryptoService = require('../services/cryptoService');

const { isAuthenticated } = require('../middlewares/authMid');
const { getErrorMessage } = require('../util');

const validator = require('validator');

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

        const bought = await hasBought(req.params.cryptoId, req.user._id);
        console.log(bought);

        res.render('crypto/details', { ...crypto, isOwner, bought });
    } catch (error) {
        res.render('home/404');
    }
});

router.get('/create', isAuthenticated, (req, res) => {
    res.render('crypto/create');
});

router.post('/create', isAuthenticated, async (req, res) => {
    try {
        if (!validator.isURL(req.body.imageUrl)) {
            throw {
                message: 'URL must be valid!',
            };
        }
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

router.get('/delete/:cryptoId', isAuthenticated, async (req, res) => {
    const crypto = await cryptoService.getOne(req.params.cryptoId).lean();
    try {
        const isOwner = crypto.owner._id == req.user?._id;
        if (!isOwner) {
            throw {
                message: 'Not an owner!',
            };
        }

        await cryptoService.delete(req.params.cryptoId);

        res.redirect('/crypto');
    } catch (error) {
        console.log(error);
        res.render('home/404');
    }
});

router.get('/buy/:cryptoId', isAuthenticated, async (req, res) => {
    const crypto = await cryptoService.getOneWithBuyers(req.params.cryptoId).lean();
    try {
        const isOwner = crypto.owner._id == req.user?._id;

        if (isOwner) {
            throw {
                message: 'Cannot buy if owner!!',
            };
        }

        await cryptoService.buy(crypto._id, req.user._id);

        res.redirect(`/crypto/details/${crypto._id}`);
    } catch (error) {
        res.render('home/404');
    }
});

const hasBought = async (cryptoId, userId) => {
    const crypto = await cryptoService.getOne(cryptoId);

    return crypto.buyACrypto.includes(userId);
};

module.exports = router;
