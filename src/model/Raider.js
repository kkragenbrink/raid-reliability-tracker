"use strict";

var mongoose = require('mongoose');
var RaiderSchema = mongoose.Schema({
    name: {type: String},
    server: {type: String},
    primaryRole: {type: String, enum: ['DPS', 'Healer', 'Tank']},
    secondaryRole: {type: String, enum: ['DPS', 'Healer', 'Tank']},
    scores: [{
        week: {type: Number},
        score: {type: Number},
        reasons: [{
            value: {type: Number},
            reason: {type: String}
        }]
    }]
});
RaiderSchema.set('autoIndex', false);
RaiderSchema.index({name: 1, server: 1}, {unique: true});
var RaiderModel = mongoose.model('Raider', RaiderSchema);

module.exports = RaiderModel;
