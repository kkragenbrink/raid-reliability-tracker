"use strict";

var assert = require('assert');
var proxyquire = require('proxyquire');
var MockFs = require("q-io/fs-mock");

suite('server', function () {
    var server;

    server = proxyquire('../src/server', {
        'q-io/fs' : MockFs({'../cfg/server.yml' : 'app:\n  name: test'}),
        './Main' : function () {}
    });

    test('should update the process title', function () {
        assert.equal(process.title, 'node test');
    });
});