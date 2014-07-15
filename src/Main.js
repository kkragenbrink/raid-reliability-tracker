"use strict";

require('js-yaml');
var cluster = require('cluster');
var config = require('../cfg/server.yml');
var log = require('./Log').createLogger('src.Main');

/**
 * The main application thread.
 * Creates and manages workers and handles POSIX signals.
 * @constructor
 */
var Main = function Main () {
    log.debug('main');
    this.shuttingDown = false;

    cluster.on('exit',      this.restartWorker.bind(this));
    process.on('SIGTERM',   this.shutdown.bind(this));
    process.on('SIGINT',    this.shutdown.bind(this));

    cluster.setupMaster({exec : 'src/Worker.js' });
    for (var i = 0; i < config.workers.maxConcurrentWorkers; i++) {
        this.createWorker();
    }
};

Main.prototype.createWorker = function () {
    log.debug('createWOrker');
    var worker = cluster.fork();
};

Main.prototype.restartWorker = function () {
    log.debug('restartWorker');
    if (!this.shuttingDown) {
        log.warn('Worker %d died with code %d.', worker.process.pid, code);
        this.createWorker();
    }
};

Main.prototype.shutdown = function () {
    log.debug('shutdown');

    this.shuttingDown = true;

    for (var i in cluster.workers) {
        cluster.workers[i].kill();
    }

    process.exit();
};

module.exports = Main;