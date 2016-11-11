'use strict';
// jshint esversion: 6
// jshint devel: true
// jshint node: true
// jshint browser: true
// jshint mocha: true

exports.seed = function(knex, Promise) {
    // Deletes ALL existing entries
    return knex('favorites').del()
        .then(function() {
            return knex('favorites').insert([{
                id: 1,
                book_id: 1,
                user_id: 1,
                created_at: new Date('2016-06-29 14:26:16 UTC'),
                updated_at: new Date('2016-06-29 14:26:16 UTC')
            }]);
        });
};
