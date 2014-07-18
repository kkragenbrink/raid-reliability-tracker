var mongoose = require('mongoose');
var mockgoose = require('mockgoose');
mockgoose(mongoose);

mongoose.connect('mongodb://localhost/test');