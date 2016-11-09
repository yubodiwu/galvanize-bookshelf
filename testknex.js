'use strict';
// jshint esversion: 6
// jshint devel: true
// jshint node: true
// jshint browser: true
// jshint mocha: true

const knex = require('knex');

knex(`books`).columnInfo().then(function(actual) {
    console.log(actual);
});
