// load config
var fs = require('fs'), path = require('path');
if (fs.existsSync(path.join(__dirname, '.env'))) {
    var env = require('node-env-file');
    env('.env');
}

var models = require('./models'),
	express = require('express'),
	chalk = require('chalk'),
	logger = require('morgan'),
	Client = require('twilio').Client;


// check configuration
if (!process.env.TWILIO_SID || !process.env.TWILIO_TOKEN || !process.env.TWILIO_NUMBER) {
    console.log(chalk.red('Error:') + ' You need to set TWILIO_SID, TWILIO_TOKEN, & TWILIO_NUMBER environment variables. Please see README.md, under "configuration", for more info.')
    process.exit(1);
}

var client = new Client(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);
var phone = client.getPhoneNumber(process.env.TWILIO_NUMBER);

phone.setup(function(){
	phone.on('incomingSms', function(reqParams, res) {
		console.log(chalk.green('Received SMS') +' (' + chalk.yellow(reqParams.From) + '): ' + reqParams.Body);
	});

	phone.on('incomingCall', function(reqParams, res) {
		res.append(new Twiml.Say('Thanks for calling! The feminist phone app is not ready, yet. Call back, soon.'));
        res.send();
	});
});