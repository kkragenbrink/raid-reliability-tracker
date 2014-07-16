"use strict";

var fs = require('fs');
var yaml = require('js-yaml');

var config = yaml.load(fs.readFileSync('./cfg/server.yml'));
var Main = require('./src/Main');

process.title = 'node ' + config.app.name;

new Main(config);