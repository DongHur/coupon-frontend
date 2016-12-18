const express = require('express');
const router = express.Router();
const request = require('request');
const config = require('../app/models/config');

router.get('/', (req, res, next) => {
    return res.render('index');
});

router.post('/', (req, res, next) => {
    request.post(config.apiUrl + '/users', {form: req.body}).pipe(res);
});

module.exports = router;
