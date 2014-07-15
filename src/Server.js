"use strict";

var Express = require('express');

var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var log = require('./Log').getLogger('src.Server');

var Server = function Server (config) {
    log.debug('constructor');

    this.config = config;
    this.servers = [];

    this.app = new Express;
    this.app.use(bodyParser());
    this.app.use(cookieParser());
};

Server.prototype.addRoute = function (method, uri, handler) {
    log.debug('addRoute');

    this.app[method.toLowerCase()](uri, handler);
};

Server.prototype.bindAddress = function (address) {
    log.debug('bindAddress');
    address.host = address.host || '0.0.0.0';

    this.servers.push(this.app.listen(address.port, address.host));
    log.info('Listening on %s port %s.', address.host, address.port);
};

Server.prototype.unbindAddress = function (server) {
    log.debug('unbindAddress');
    server.close();
};

Server.prototype.start = function () {
    log.debug('start');

    this.config.bind.forEach(this.bindAddress.bind(this));
};

Server.prototype.stop = function () {
    log.debug('stop');

    this.servers.forEach(this.unbindAddress.bind(this));
};

module.exports = Server;