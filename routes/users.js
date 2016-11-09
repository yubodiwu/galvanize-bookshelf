'use strict';

const express = require('express');
const bcrypt = require('bcrypt-as-promised');
const knex = require('../knex')

// eslint-disable-next-line new-cap
const router = express.Router();

router.post('/users', function(req, res) {
    console.log('users post is hit');
    var pw = req.body.password;
    var hashedPw;

    bcrypt.hash(pw, 12)
        .then((hashedPassword) => {
            return hashedPassword;
        }).then(function(hashedPassword) {
            knex('users')
                .insert({
                    first_name: req.body.firstName,
                    last_name: req.body.lastName,
                    email: req.body.email,
                    hashed_password: hashedPassword
                })
                .returning(['id', 'first_name', 'last_name', 'email'])
                .then(function(user) {
                    res.send(_convertForTests(user)[0]);
                });
        });
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

function _toCamelCase(string) {
    return string.slice(0,string.indexOf(`_`)) + string[string.indexOf(`_`) + 1].toUpperCase() +  string.slice(string.indexOf(`_`) + 2, string.length);
}

module.exports = router;
