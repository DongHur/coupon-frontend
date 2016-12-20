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

router.get('/admin', auth.adminRequired, (req, res, next) => {
    if (req.user.isAdmin || req.user.isSuperAdmin)
        return res.redirect('/admin/coupons?token=' + req.token);
    return res.render('logout');
});

router.get('/admin/coupons', auth.adminRequired, (req, res, next) => {
    return res.render('coupons', {token: req.token, isSuperAdmin: !!req.user.isSuperAdmin});
});


router.post('/admin/coupons', auth.adminRequired, (req, res, next) => {
    req.body.postedBy = req.user.id;
    req.body.companyName = req.user.companyName;
    request.post({
        url: config.apiUrl + '/coupons',
        headers: {'x-access-token': req.token},
        form: req.body
    }).pipe(res);
});

module.exports = router;
