require('./config');

var models = require('./models'),
	Quote = models.Quote;

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
			process.exit(0);
		}
	});
});