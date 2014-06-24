// load config
require('./config');

var models = require('./models'),
	Message = models.Message,
	Quote = models.Quote,
	express = require('express'),
	chalk = require('chalk'),
	logger = require('morgan'),
	twilio = require('twilio'),
	express = require('express'),
	logger = require('morgan'),
	bodyParser = require('body-parser'),
	app = express();

// configure basic webserver
app.use(logger('dev'));
app.use(bodyParser({extended: true}));


// check configuration
if (!process.env.TWILIO_SID || !process.env.TWILIO_TOKEN) {
    console.log(chalk.red('Error:') + ' You need to set TWILIO_SID, & TWILIO_TOKEN environment variables. Please see README.md, under "configuration", for more info.')
    process.exit(1);
}


var client = twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);

app.post('/sms', function(req, res){
	Quote.random(function(err, quote){
		

		var msg = new Message({
	        type: 'text',
	        message: req.body.Body,
	        city: req.body.FromCity,
	        state: req.body.FromState,
	        country: req.body.FromCountry,
	        number: req.body.From,
	        response: quote['_id']
	    });

		console.log(msg);

	    msg.save(function(err, model) {
	        var twiml = new twilio.TwimlResponse().message(quote.text);
	        res.send(twiml);
	    });
	});	
});


var port = Number(process.env.PORT || 5000);
app.listen(port, function() {
    console.log('Listening on ' + chalk.underline(chalk.blue('http://0.0.0.0:' + port)));
});