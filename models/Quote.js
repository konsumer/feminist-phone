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

var Quote = module.exports;

// fill-in records, if there are none, with some defaults
Quote.count(function(err, count) {
	if (!count){
		var quotes = [
			{"author": "bell hooks", "text": "Sometimes, people try to destroy you, precisely because they recognize your power. Not because they do not see it, but because they see it and they do not want it to exist."},
			{"author": "bell hooks", "text": "Whenever domination is present, love is lacking."},
			{"author": "bell hooks", "text": "If any female feels she needs anything beyond herself to legitimate and validate her existence, she is already giving away her power to be self-defining, her agency."}
		];
		quotes.forEach(function(q, i){
			var quote = new Quote(q);
			quote.save(function(er){
				if(er){
					console.log(er);
					process.exit(1);
				}
				if (i == quotes.length-1){
					console.log('Created ' + quotes.length + ' quotes.');
				}
			});
		});
	}
});