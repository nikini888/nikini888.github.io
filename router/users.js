const express = require('express');
const passport = require('passport')
const { user } = require('../controllers/user.js')
const router = express.Router();

const passportCheck = passport.authenticate('local', {
    failureFlash: true,
    failureRedirect: '/login',
})

router.route('/register')
    .get(user.renderRigister)
    .post(user.registerNewUser)

router.route('/login')
    .get(user.renderLogin)
    .post(passportCheck, user.userLogin)

router.get('/logout', user.userLogout)

module.exports = router;
