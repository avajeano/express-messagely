const express = ("express");
const jwt = require("jsonwebtoken");
const Router = require("express").Router;
const router = new Router();
const { SECRET_KEY } = require("../config");
const ExpressError = require("../expressError");
const { authenticate, updateLoginTimestamp, register } = require('../models/user');

/** POST /login - login: {username, password} => {token}
 *
 * Make sure to update their last-login!
 *
 **/

router.post('/login', async(req, res, next) => {
    try {
        let { username, password } = req.body;
        if(await authenticate(username, password)) {
            let token = jwt.sign({ username }, SECRET_KEY);
            updateLoginTimestamp(username);
            return res.json({ token });
        }   else {
            throw new ExpressError("Invalid username/password", 400);
        }
    }   catch(e) {
        return next(e)
    }
});

/** POST /register - register user: registers, logs in, and returns token.
 *
 * {username, password, first_name, last_name, phone} => {token}.
 *
 *  Make sure to update their last-login!
 */

router.post('/register', async(req, res, next) => {
    try {
        let { username } = await register(req.body);
        let token = jwt.sign({ username }, SECRET_KEY);
        updateLoginTimestamp(username);
        return res.json({ token });
    }   catch(e) {
        return next(e)
    }
});

module.exports = router;