/**
 * Mongoose model for an incoming text-message
 */

var mongoose = require('mongoose');

var Message = new mongoose.Schema({
    number: String,
    type: {type:String, enum:['call', 'text']},
    recordingUrl: String,
    recordingDuration: Number,
    textMessage: String,
    city: String,
    state: String,
    country: String,
    date:{ type: Date, default: Date.now },
    response: String
});

module.exports = mongoose.model('Message', Message);