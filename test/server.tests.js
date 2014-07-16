"use strict";

var assert = require('assert');
var proxyquire = require('proxyquire');
var mockfs = require('mock-fs');

suite('server', function () {
    var server;

    server = proxyquire('../server', {
        'fs' : mockfs.fs({'./cfg/server.yml' : 'app:\n  name: test'}),
        './src/Main' : function () {}
    });

    test('should update the process title', function () {
        assert.equal(process.title, 'node test');
    });
});