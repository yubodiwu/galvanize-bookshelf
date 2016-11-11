'use strict';
// jshint esversion: 6
// jshint devel: true
// jshint node: true
// jshint browser: true
// jshint mocha: true

const express = require('express');
const bcrypt = require('bcrypt-as-promised');
const knex = require('../knex');
// eslint-disable-next-line new-cap
const router = express.Router();

router.get(`/token`, function(req, res) {
    res.send(false);
});

router.post(`/token`, function(req, res) {
    res.cookie('token','9000',{
        maxAge: 90000,
        httpOnly: true
    })
        console.log(`cookie: `, res.cookies);
    var sendObj = {};

    for (let key in req.body) {
        if (key !== 'password') {
            sendObj[key] = req.body[key];
        }
    }

    res.send(req.session);
});

module.exports = router;
