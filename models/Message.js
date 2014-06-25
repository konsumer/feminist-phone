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
}, { capped: 1024 });

// filter phone number for privacy
Message.statics.filterPhone = function (message){
    console.log(message);
    return {
        type: message.type,
        recordingUrl: message.recordingUrl,
        recordingDuration: message.recordingDuration,
        textMessage: message.textMessage,
        city: message.city,
        state: message.state,
        country: message.country,
        date: message.date,
        response: message.response
    };
}

module.exports = mongoose.model('Message', Message);