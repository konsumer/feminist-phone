/**
 * Mongoose model for an incoming voice call
 */

var mongoose = require('mongoose');

var Call = new mongoose.Schema({
    "timestamp": {type: Date, default: Date.now},
    "number": Number
});

module.exports = mongoose.model('Call', Call);