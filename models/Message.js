/**
 * Mongoose model for an incoming text-message
 */

var mongoose = require('mongoose');

var Message = new mongoose.Schema({
	sid: String,
    number: Number,
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