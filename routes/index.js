var express = require('express');
var router = express.Router();

router.get('/', (req, res, next) => {
    return res.render('index');
});

router.post('/', (req, res, next) => {
    res.json(req.body);
});

module.exports = router;
