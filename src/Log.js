"use strict";

require('js-yaml');

var config = require('../cfg/server.yml').log;
var log = require('log4js');
var util = require('util');

log.configure(config);

var getLogger = log.getLogger;

log.getLogger = function (name) {
    var logger = getLogger(name);

    logger.setLevel(config.levels[name] || config.levels['default']);
    return logger;
};