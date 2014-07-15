"use strict";

var Database = require('../adapter/Database');
var RaiderModel = require('../model/Raider');

var log = require('../Log').getLogger('src.route.Raider');
var util = require('util');

var Raider = function Raider () {
    this.db = new Database;
};

Raider.prototype.get = function GET () {
    this.db.getRaiders(this.request.param('id'))
        .then(this.convertToModel.bind(this), this.reject)
        .then(this.resolve)
        .done();
};

Raider.prototype.convertToModel = function (raider) {
    if (util.isArray(raider)) {
        raider.forEach(this.convertToModel.bind(this));
    }
    else {
        raider = new RaiderModel(raider);
    }

    return raider;
};

module.exports = Raider;