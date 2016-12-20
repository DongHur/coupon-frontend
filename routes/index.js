const express = require('express');
const router = express.Router();
const request = require('request');
const config = require('../app/models/config');
const auth = require('./auth');

router.get('/', (req, res, next) => {
    return res.render('index', {providers: config.providers});
});
router.post('/', (req, res, next) => {
    request.post(config.apiUrl + '/users', {form: req.body}).pipe(res);
});

router.get('/login', (req, res, next) => {
    return res.render('login');
});
router.post('/login', (req, res, next) => {
    request.post(config.apiUrl + '/auth/token', {form: req.body}).pipe(res);
});

router.all('/logout', (req, res, next) => {
    return res.render('logout');
});

module.exports = router;
