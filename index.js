// load config
var fs = require('fs'), path = require('path');
if (fs.existsSync(path.join(__dirname, '.env'))) {
    var env = require('node-env-file');
    env('.env');
}

var models = require('./models'),
	Message = models.Message,
	Quote = models.Quote,
	chalk = require('chalk'),
	logger = require('morgan'),
	twilio = require('twilio'),
	express = require('express.io'),
	logger = require('morgan'),
	bodyParser = require('body-parser'),
	serveStatic = require('serve-static'),
	path = require('path'),
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
	        	.message(quote.text + ' - ' + quote.author)
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
		    	.say(quote.text + ' - a quote from ' + quote.author, {voice:'woman'})
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

// map function for removing phone-number
function filterPhone(message){
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

// get 30 newest messages & texts with personal phone number filtered
function getNewMessages(cb){
	var out = {};
	Message.find({type:"text"})
		.sort({date: -1})
		.limit(30)
		.exec(function(err, texts){
			if (err) return cb(err);
			out.texts = texts.map(filterPhone);
			Message.find({type:"call"})
				.sort({date: -1})
				.limit(30)
				.exec(function(err, calls){
					if (err) return cb(err);
					out.calls = calls.map(filterPhone);
					return cb(null, out);
				});
		});
}


// setup socket.io for realtime data

app.http().io();

app.io.route('ready', function(req) {
    var socket = req.io;
    socket.broadcast('user:new');

    getNewMessages(function(err, messages){
    	if (err) return console.log(err);
		messages.texts.forEach(function(message){
			socket.emit('message:text', message);
		});
		messages.calls.forEach(function(message){
			socket.emit('message:call', message);
		});
    });

    Quote.find({}, function(err, results){
		if(err) return console.log(err);
		results.forEach(function(quote){
			socket.emit('quote:add', quote);
		});
	});
});


/*

// If you want JSON service for this info, rather than socket.io realtime updates, use these:


// get a list of calls, with number info removed
app.get('/calls', function(req,res){
	Message.find({}).sort({date: -1}).limit(30).exec(function(err, results){
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
				"recordingUrl": call.recordingUrl,
				"recordingDuration": call.recordingDuration,
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

 */



//  static service
app.use(serveStatic(path.join(__dirname, 'public')));


var port = Number(process.env.PORT || 5000);
var server = app.listen(port, function() {
    console.log('Listening on ' + chalk.underline(chalk.blue('http://0.0.0.0:' + port)));
});