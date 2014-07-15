"use strict";

require('js-yaml');
var cluster = require('cluster');
var config = require('../cfg/server.yml');
var log = require('./Log').getLogger('src.Worker');

var Server = require('./Server');
var Router = require('./Router');

var Worker = function Worker () {
    log.info('Worker %s starting up.', process.pid);

    process.title = 'node rrt worker';
    process.on('SIGINT',    this.shutdown.bind(this));
    process.on('SIGTERM',   this.shutdown.bind(this));

    this.server = new Server(config);
    this.router = new Router(this.server, this.config);
    this.server.start();
};

Worker.prototype.shutdown = function () {
    log.debug('shutdown');

    this.server.stop();
    process.exit();
};

if (cluster.isMaster) { module.exports = Worker; }
else { new Worker; }
