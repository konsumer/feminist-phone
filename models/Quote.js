/**
 * Mongoose model for a quote
 */

var mongoose = require('mongoose');

var Quote = new mongoose.Schema({
	author: String,
    text: String
});

Quote.statics.random = function(callback) {
  this.count(function(err, count) {
    if (err) {
      return callback(err);
    }
    var rand = Math.floor(Math.random() * count);
    this.findOne().skip(rand).exec(callback);
  }.bind(this));
};

module.exports = mongoose.model('Quote', Quote);