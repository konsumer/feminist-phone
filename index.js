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

			req.io.emit('message:text', Message.filterPhone(model));

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
		
		req.io.emit('message:call', Message.filterPhone(model));

		res.send(new twilio.TwimlResponse()
			.say('goodbye.', {voice:'woman'})
        	.hangup()
        	.toString()
        );
	});
});

// setup socket.io for realtime data
app.http().io();

// when a user connects, send them messages & quotes, & send other clients user:new
// tail the capped collections, so new records also send messages
app.io.route('ready', function(req) {
    var socket = req.io;
    socket.broadcast('user:new');

    Message.find({type:"text"}).stream()
		.on('data', function (message) {
			socket.emit('message:text', Message.filterPhone(message));
		});

	Message.find({type:"call"}).stream()
		.on('data', function (message) {
			socket.emit('message:call', Message.filterPhone(message));
		});

	Quote.find({}).stream()
		.on('data', function (quote) {
			socket.emit('quote:add', quote);
		});
});


//  static service
app.use(serveStatic(path.join(__dirname, 'public')));


var port = Number(process.env.PORT || 5000);
var server = app.listen(port, function() {
    console.log('Listening on ' + chalk.underline(chalk.blue('http://0.0.0.0:' + port)));
});