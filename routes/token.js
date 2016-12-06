'use strict';
// jshint esversion: 6
// jshint devel: true
// jshint node: true
// jshint browser: true
// jshint mocha: true

const express = require('express');
const bcrypt = require('bcrypt-as-promised');
const knex = require('../knex');
const router = express.Router();
const boom = require('boom');

router.get(`/token`, function(req, res) {
    if (req.cookies['/token'] === 'thing.thing.thing') {
        res.status(200).json(true);
    } else {
        res.json(false);
    }
});

router.post(`/token`, function(req, res) {
    knex('users')
        .where('email', req.body.email)
        .then(function(user) {
            user = user[0];

            if (!user) {
                res.status(400).send('Bad email or password');
                return;
            }

            bcrypt.compare(req.body.password, user.hashed_password)
                .then(function() {
                    res.cookie('/token', 'thing.thing.thing', {
                        path: '/',
                        httpOnly: true
                    });
                    res.json({
                        id: user.id,
                        firstName: user.first_name,
                        lastName: user.last_name,
                        email: user.email
                    });
                })
                .catch(function() {
                    res.status(400).send('Bad email or password');
                })
        })


});

router.delete(`/token`, function(req, res) {
    res.clearCookie(`/token`, {
        path: '/'
    });
    res.json(true);
});

module.exports = router;
