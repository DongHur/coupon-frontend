const jwt = require('jwt-simple');
const config = require('../app/models/config');

exports.adminRequired = (req, res, next) => {
    validateToken(req, res, next, {adminRequired: true});
};

exports.superAdminRequired = (req, res, next) => {
    validateToken(req, res, next, {superAdminRequired: true});
};

function validateToken(req, res, next, c) {
    var token = req.body.token || req.query.token || req.headers['x-access-token'];

    if (!token) return res.redirect('/login');

    try {
        var decoded = jwt.decode(token, config.secret);
    } catch(err) {
        return res.redirect('/login');
    }

    if (c.adminRequired && !decoded.isAdmin && !decoded.isSuperAdmin)
        return res.redirect('/login');
    if (c.superAdminRequired && !decoded.isSuperAdmin)
        return res.redirect('/login');

    if (!decoded.id) return res.redirect('/login');

    req.user = decoded;
    next();
}
