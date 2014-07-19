"use strict";

var Main = require('./Main');

var fs = require('q-io/fs');
var yaml = require('js-yaml');

fs.read('../cfg/server.yml')
.then(function (cfg) {
    var config = yaml.load(cfg);
    process.title = 'node ' + config.app.name;
        new Main(config);
});
