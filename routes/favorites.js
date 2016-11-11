'use strict';
// jshint esversion: 6
// jshint devel: true
// jshint node: true
// jshint browser: true
// jshint mocha: true

const express = require('express');
const knex = require('../knex');
const helpers = require('./helper_functions')

// eslint-disable-next-line new-cap
const router = express.Router();

router.get(`/favorites`, function(req, res) {
    knex(`favorites`)
        .select()
        .join(`books`, `favorites.book_id`, `books.id`)
        .then(function(favorites) {
            res.send(helpers.convertForTests(favorites));
        });
});

router.get(`/favorites/check`, function(req, res) {
    for (let key in req.query) {
        knex(`favorites`)
            .select()
            .where(helpers.toSnakeCase(key), req.query[key])
            .then(function(favorites) {
                if (favorites.length > 0) {
                    res.send(true);
                } else {
                    res.send(false);
                }
            })
    }
});

router.post(`/favorites`, function(req, res) {
    knex(`favorites`)
        .insert(helpers.snakeAllKeys(req.body))
        .returning(`*`)
        .then(function(favorite) {
            res.send(helpers.convertForTests(favorite)[0]);
        })
});

module.exports = router;
