const User = require('../models/user')

module.exports.user = {
    renderRigister: (req, res) => {
        res.render('user/register')
    },
    registerNewUser: async (req, res) => {
        try {
            const { username, email, password, firstName, lastName } = req.body;
            const first = firstName.trim();
            const last = lastName.trim();
            const user = new User({ username, email, name: { first, last } });
            const registerUser = await User.register(user, password);
            await registerUser.save()
            req.login(registerUser, err => {
                if (err) return next(err);
                req.flash('success', "You are success to register!")
                res.redirect('/campgrounds')
            })

        } catch (e) {
            req.flash('error', e.message)
            res.redirect('/register')
        }
    },
    renderLogin: (req, res) => {
        res.render('user/login')
    },
    userLogin: (req, res) => {
        req.flash('success', `Welcome back ${req.user.username}!`)
        const finalUrl = req.session.storeUrl || '/campgrounds';
        delete req.session.storeUrl;
        res.redirect(finalUrl)
    },
    userLogout: (req, res) => {
        req.logout();
        req.flash('success', "Goodbye!");
        res.redirect('/campgrounds')
    }

}