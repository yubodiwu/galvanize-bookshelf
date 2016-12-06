'use strict';
// jshint esversion: 6
// jshint devel: true
// jshint node: true
// jshint browser: true
// jshint mocha: true

const express = require('express');
const knex = require('../knex');
const convertForTests = require('./helper_functions').convertForTests;
const snakeAllKeys = require('./helper_functions').snakeAllKeys;
const titleSortCb = require('./helper_functions').titleSortCb;

// eslint-disable-next-line new-cap
const router = express.Router();

// YOUR CODE HERE
router.get(`/books`, function(req, res) {
    console.log(`/books is hit`);
    knex('books')
        .select('*')
        .returning('*')
        .then(function(books) {
            var booksList = convertForTests(books);

            booksList.sort(titleSortCb);

            res.send(booksList);
        });
});

router.get(`/books/:id`, function(req, res) {
    console.log(`/books/:id is hit`);
    knex('books')
        .select()
        .where('id', req.params.id)
        .returning()
        .then(function(books) {
            var book = convertForTests(books)[0];

            res.send(book);
        });
});

router.post(`/books`, function(req, res) {
    console.log(`post books route hit`);
    knex('books')
        .insert(snakeAllKeys(req.body))
        .returning('*')
        .then(function(book) {
            res.send(convertForTests(book)[0]);
        });
});

router.patch(`/books/:id`, function(req, res) {
    knex('books')
        .where(`id`, req.params.id)
        .update(snakeAllKeys(req.body))
        .returning('*')
        .then(function(book) {
            res.send(convertForTests(book)[0]);
        })
        .done();
})

router.delete(`/books/:id`, function(req, res) {
    knex(`books`)
        .where(`id`, req.params.id)
        .del()
        .returning('*')
        .then(function(book) {
            let sendObj = {};

            for (let key in convertForTests(book)[0]) {
                if (key !== 'id') {
                    sendObj[key] = convertForTests(book)[0][key];
                }
            }

            res.send(sendObj);
        })
        .done();
});

module.exports = router;
