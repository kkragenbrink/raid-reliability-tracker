"use strict";

var fs = require('fs');
var log = require('./Log').getLogger('src.Router');
var q = require('q');
var util = require('util');

var config;

var Router = function Router (server, cfg) {
    log.debug('constructor');

    config = cfg;
    this.server = server;

    this.findRoutes();
};

var getRequestBenchmarker = function (benchmark, request, response) {
    return function benchmarkRequest () {
        log.debug('#benchmarkRequest');
        benchmark = process.hrtime(benchmark);
        var time = Math.round(benchmark[1] / 1000000) + (benchmark[0] * 1000);
        log.info('[%$s] %sms %s %s %s %s', request.get('x-forwarded-for'), time, response.statusCode, request.method, request.path, response.length);
    }
};

var getSuccessHandler = function (request, response) {
    return function succcessHandler (data) {
        log.debug('#successHandler');
        sendResponse(request, response, data);
    }
};

var getFailureHandler = function (request, response) {
    return function failureHandler (error) {
        log.debug('#failureHandler');

        if (!error) {
            response.statusCode = 500;
            error = new Error('Internal server error');
        }
        else if (!response.statusCode) {
            response.statusCode = 504;
        }

        error.message = JSON.stringify({
            message : error.message,
            statusCode : response.statusCode
        });

        sendResponse(request, response, error);
    }
};

var sendResponse = function (request, response, data) {
    log.debug('#sendResponse');

    response.statusCode = response.statusCode || 200;

    switch (typeof data) {
        case 'undefined': data = '"undefined"'; break;
        case 'object': data = JSON.stringify(data); break;
        default: data = data.toString(); break;
    }

    for (var i in response.headers) {
        if (i !== i.toLowerCase()) {
            response.headers[i.toLowerCase()] = response.headers[i];
            delete response.headers[i];
        }
    }

    response.headers['content-type'] = 'application/json';

    if (config.cors === true) {
        response.headers['access-control-allow-origin'] = '*';
    }

    response.headers['content-length'] = data.length;
    response.length = data.length;

    response.writeHead(response.statusCode, response.headers);
    response.end(data);
};

Router.prototype.buildRouteHandler = function (method, Route) {
    log.debug('buildRouteHandler');

    return function (request, response) {
        log.debug('routeHandler [%s] %s %s', request.get('x-forwarded-for', method, request.path));
        var benchmark = process.hrtime();
        var deferred = q.defer();

        var context = Object.create(Route.prototype);
        context.reject = deferred.reject.bind(deferred);
        context.resolve = deferred.resolve.bind(deferred);
        context.request = request;
        context.response = response;
        context.config = config;

        var runner = Route.call(context);
        runner[method]();

        deferred.promise
            .timeout(config.workers.maxCallTime)
            .then(getSuccessHandler(request, response), getFailureHandler(request, response, route))
            .then(getRequestBenchmarker(benchmark, request, response))
            .done();
    };
};

Router.prototype.setupRoute = function (route) {
    log.debug('setupRoute', route);
    var Route = require(util.format('./route/%s', route));
    var handler = new Route;

    ['get','put','post','delete'].forEach(function (method) {
        if (typeof handler[method] === 'function') {
            this.server.addRoute(method, route, this.buildRouteHandler(method, Route));
        }
    }.bind(this));
};

Router.prototype.findRoutes = function () {
    log.debug('findRoutes');

    q.nfcall(fs.readdir, './route')
        .then(function (routes) {
            routes.forEach(this.setupRoute.bind(this));
        }.bind(this))
        .done();
};