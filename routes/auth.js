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

    if (!token) return res.redirect('/logout');

    try {
        var decoded = jwt.decode(token, config.secret);
    } catch(err) {
        return res.redirect('/logout');
    }

    if (c.adminRequired && !decoded.isAdmin && !decoded.isSuperAdmin)
        return res.redirect('/logout');
    if (c.superAdminRequired && !decoded.isSuperAdmin)
        return res.redirect('/logout');

    if (!decoded.id) return res.redirect('/logout');

    req.user = decoded;
    req.token = token;
    next();
}
