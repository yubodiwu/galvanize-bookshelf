'use strict';
// jshint esversion: 6
// jshint devel: true
// jshint node: true
// jshint browser: true
// jshint mocha: true

const express = require('express');
const knex = require('../knex');

// eslint-disable-next-line new-cap
const router = express.Router();

// YOUR CODE HERE
router.get(`/books`, function(req, res) {
    console.log(`/books is hit`);
    console.log(res);
    knex('books')
        .select('*')
        .returning('*')
        .then(function(books) {
            var booksList = _convertForTests(books);

            booksList.sort(_titleSortCb);

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
            var book = _convertForTests(books)[0];

            res.send(book);
        });
});

router.post(`/books`, function(req, res) {
    console.log(`POST HIT`, req.body.id);
    console.log(req.body);
    knex('books')
        .insert(_snakeAllKeys(req.body))
        .returning('*')
        .then(function(book) {
            res.send(_convertForTests(book)[0]);
        });
});

router.patch(`/books/:id`, function(req, res) {
    knex('books')
        .where(`id`, req.params.id)
        .update(_snakeAllKeys(req.body))
        .returning('*')
        .then(function(book) {
            res.send(_convertForTests(book)[0]);
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

            for (let key in _convertForTests(book)[0]) {
                if (key !== 'id') {
                    sendObj[key] = _convertForTests(book)[0][key];
                }
            }

            res.send(sendObj);
        })
        .done();
});

function _convertForTests(books) {
    var booksList = [];

    for (let book of books) {
        var newBook = {};

        for (let key in book) {
            if (key.indexOf(`_`) !== -1) {
                let newKey = _toCamelCase(key);

                if (key === 'created_at' || key === 'updated_at') {
                    let timeStr = JSON.stringify(book[key]);
                    newBook[newKey] = timeStr.slice(1,-1);
                } else {
                    newBook[newKey] = book[key].toString();
                }
            } else {
                newBook[key] = book[key];
            }
        }

        booksList.push(newBook);
    }

    return booksList;
}

function _snakeAllKeys(obj) {
    var newObj = {};

    for (let key in obj) {
        newObj[_toSnakeCase(key)] = obj[key];
    }

    return newObj;
}

function _titleSortCb(book1, book2) {
    var title1 = book1.title.toUpperCase();
    var title2 = book2.title.toUpperCase();

    return (title1 < title2) ? -1 : (title1 > title2) ? 1 : 0;
}

function _toCamelCase(string) {
    return string.slice(0,string.indexOf(`_`)) + string[string.indexOf(`_`) + 1].toUpperCase() +  string.slice(string.indexOf(`_`) + 2, string.length);
}

function _toSnakeCase(string) {
    return string.replace(/([A-Z])/g, function(key, letter) {
        return '_' + letter.toLowerCase();
    });
}

module.exports = router;
