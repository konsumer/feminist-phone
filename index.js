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



// configure basic webserver
app.use(logger('dev'));
app.use(bodyParser({extended: true}));


// check configuration
if (!process.env.TWILIO_SID || !process.env.TWILIO_TOKEN) {
    console.log(chalk.red('Error:') + ' You need to set TWILIO_SID, & TWILIO_TOKEN environment variables. Please see README.md, under "configuration", for more info.')
    process.exit(1);
}


var client = twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);

// handle incoming SMS
app.post('/sms', function(req, res){
	Quote.random(function(err, quote){
		if(err){
			console.log(err);
			return res.send(500, err);
		}
		
		var msg = new Message({
	        type: 'text',
	        city: req.body.FromCity,
	        state: req.body.FromState,
	        country: req.body.FromCountry,
	        number: req.body.From,
	        response: quote['_id'],
	        textMessage: req.body.Body
	    });
	    
	    msg.save(function(err, model) {
	    	if(err){
				console.log(err);
				return res.send(500, err);
			}

	        res.send(new twilio.TwimlResponse()
	        	.message(quote.text)
	        	.toString()
	        );
	    });
	});	
});

// handle incoming voice call
app.post('/voice', function(req, res){
	Quote.random(function(err, quote){
		if(err){
			console.log(err);
			return res.send(500, err);
		}

		var msg = new Message({
	        type: 'call',
	        city: req.body.FromCity,
	        state: req.body.FromState,
	        country: req.body.FromCountry,
	        number: req.body.From,
	        response: quote['_id']
	    });

		msg.save(function(err, model) {
			if(err){
				console.log(err);
				return res.send(500, err);
			}
			
			res.send(new twilio.TwimlResponse()
		    	.say(quote.text, {voice:'woman'})
		        .record({
		            maxLength:120,
		            action:'/recording/' + msg['_id']
		        })
		        .toString()
		    );
		});
	});
});

// handle recording
app.post('/recording/:voice', function(req, res){
	Message.findByIdAndUpdate(req.params.voice, {
		recordingUrl: req.body.RecordingUrl,
		recordingDuration: Number(req.body.RecordingDuration)
	},function(err, model){
		if(err){
			console.log(err);
			return res.send(500, err);
		}

		res.send(new twilio.TwimlResponse()
			.say('goodbye.', {voice:'woman'})
        	.hangup()
        	.toString()
        );
	});
});

// get a list of quotes, with number info removed
// TODO: fit this better to a per-conversation style
// TODO: limit conversations, so it's just "newest"
app.get('/calls', function(req,res){
	Message.find({}, function(err, results){
		if(err){
			console.log(err);
			return res.send(500, err);
		}
		
		res.send(results.map(function(call){
			return {
				"_id": call['_id'],
				"__v": call['__v'],
				"type": call.type,
				"city": call.city,
				"state": call.state,
				"country": call.country,
				"response": call.response,
				"textMessage": call.textMessage,
				"date": call.date
			};
		}));
	});
});

// get list of quotes
app.get('/quotes', function(req,res){
	Quote.find({}, function(err, results){
		if(err){
			console.log(err);
			return res.send(500, err);
		}
		res.send(results);
	});
});


var port = Number(process.env.PORT || 5000);
app.listen(port, function() {
    console.log('Listening on ' + chalk.underline(chalk.blue('http://0.0.0.0:' + port)));
});