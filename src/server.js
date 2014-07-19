"use strict";

var fs = require('fs');
var yaml = require('js-yaml');
var config = yaml.load(fs.readFileSync('../cfg/server.yml'));
var Main = require('./Main');

process.title = 'node ' + config.app.name;


new Main(config);