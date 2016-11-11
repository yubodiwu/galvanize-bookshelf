'use strict';
// jshint esversion: 6
// jshint devel: true
// jshint node: true
// jshint browser: true
// jshint mocha: true

exports.up = function(knex, Promise) {
    return Promise.all([
        knex.schema.createTable('books', function(table) {
            table.increments('id').primary();
            table.string('title').notNullable().defaultTo('');
            table.string('author').notNullable().defaultTo('');
            table.string('genre').notNullable().defaultTo('');
            table.text('description').notNullable().defaultTo('');
            table.text('cover_url').notNullable().defaultTo('');
            table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
            table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());
        }),
        knex.schema.createTable('users', function(table) {
            table.increments('id').primary();
            table.string('first_name').notNullable().defaultTo('');
            table.string('last_name').notNullable().defaultTo('');
            table.string('email').notNullable().unique();
            table.specificType('hashed_password', 'char(60)').notNullable();
            table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
            table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());
        }),
        knex.schema.createTable('favorites', function(table) {
            table.increments().primary();
            table.integer('book_id').notNullable().references('id').inTable('books').onDelete('cascade');
            table.integer('user_id').notNullable().references('id').inTable('users').onDelete('cascade');
            table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
            table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());
        })
    ])
};

exports.down = function(knex, Promise) {
    return Promise.all([
        knex.schema.dropTable('favorites'),
        knex.schema.dropTable('books'),
        knex.schema.dropTable('users')
    ]);
};
