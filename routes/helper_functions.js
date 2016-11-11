'use strict';
// jshint esversion: 6
// jshint devel: true
// jshint node: true
// jshint browser: true
// jshint mocha: true

function convertForTests(books) {
    var booksList = [];

    for (let book of books) {
        var newBook = {};

        for (let key in book) {
            if (key.indexOf(`_`) !== -1) {
                let newKey = toCamelCase(key);

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

function snakeAllKeys(obj) {
    var newObj = {};

    for (let key in obj) {
        newObj[toSnakeCase(key)] = obj[key];
    }

    return newObj;
}

function titleSortCb(book1, book2) {
    var title1 = book1.title.toUpperCase();
    var title2 = book2.title.toUpperCase();

    return (title1 < title2) ? -1 : (title1 > title2) ? 1 : 0;
}

function toCamelCase(string) {
    return string.slice(0,string.indexOf(`_`)) + string[string.indexOf(`_`) + 1].toUpperCase() +  string.slice(string.indexOf(`_`) + 2, string.length);
}

function toSnakeCase(string) {
    return string.replace(/([A-Z])/g, function(key, letter) {
        return '_' + letter.toLowerCase();
    });
}

module.exports = {
    convertForTests,
    snakeAllKeys,
    titleSortCb,
    toCamelCase,
    toSnakeCase
};
