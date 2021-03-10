const db = require('./db/models')

const loginUser = (req, res, user) => {
    req.session.auth = {
        userId: user.id
    }
}

const restoreUser = async (req, res, next) => {
    // Log the session object to the console
    // to assist with debugging.
    res.locals.needLogin = false;
    if (req.session.auth) {
        const { userId } = req.session.auth;
        try {
            const user = await db.User.findByPk(userId);
            if (user) {
                res.locals.authenticated = true;
                res.locals.user = user;
                next();
            }
        } catch (err) {
            res.locals.authenticated = false;
            next(err);
        }
    } else {
        res.locals.authenticated = false;
        next();
    }
};

const logOutUser = (req, res) => {
    delete req.session.auth
}
const requireAuth = (req, res, next) => {
    if (!res.locals.authenticated) {
        needLogin = true;
        return res.render('login', {title: 'Login', csrfToken: req.csrfToken(), needLogin});
    }
    return next();
}


module.exports = {
    loginUser,
    restoreUser,
    logOutUser,
    requireAuth
}
