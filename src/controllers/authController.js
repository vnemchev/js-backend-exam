const router = require('express').Router();
const authService = require('../services/authService');

const { isAuthenticated } = require('../middlewares/authMid');
const { getErrorMessage } = require('../util');

router.get('/register', (req, res) => {
    res.render('auth/register');
});

router.post('/register', async (req, res) => {
    const { username, email, password, repeatPass } = req.body;

    try {
        if (password !== repeatPass) {
            throw {
                message: 'Passwords must match!',
            };
        }
        const token = await authService.register(username, email, password);

        res.cookie('session', token, { httpOnly: true });

        res.redirect('/');
    } catch (error) {
        res.render('auth/register', { ...req.body, error: getErrorMessage(error) });
    }
});

router.get('/login', (req, res) => {
    res.render('auth/login');
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    console.log(req.body);
    try {
        const token = await authService.login(email, password);

        res.cookie('session', token, { httpOnly: true });

        res.redirect('/');
    } catch (error) {
        res.render('auth/login', { ...req.body, error: getErrorMessage(error) });
    }
});

router.get('/logout', isAuthenticated, (req, res) => {
    res.clearCookie('session');
    res.redirect('/');
});

module.exports = router;
