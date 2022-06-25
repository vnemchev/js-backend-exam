const router = require('express').Router();

router.get('/', (req, res) => {
    res.render('crypto/catalog');
});

router.get('/create', (req, res) => {
    res.render('crypto/create');
});

module.exports = router;
