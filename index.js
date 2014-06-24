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
	Client = require('twilio-api').Client,
	express = require('express'),
	logger = require('morgan'),
	app = express();


// check configuration
if (!process.env.TWILIO_SID || !process.env.TWILIO_TOKEN || !process.env.TWILIO_NUMBER || !process.env.TWILIO_APP) {
    console.log(chalk.red('Error:') + ' You need to set TWILIO_SID, TWILIO_TOKEN, TWILIO_APP, & TWILIO_NUMBER environment variables. Please see README.md, under "configuration", for more info.')
    process.exit(1);
}

var client = Client(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);

client.account.getApplication(process.env.TWILIO_APP, function(err, phone) {
	if(err) throw err;
	phone.register();
	phone.on('incomingSMSMessage', function(smsMessage) {
		console.log(smsMessage);
	});
});



// web interaction
app.use(logger('dev'));
app.use(client.middleware());

var port = Number(process.env.PORT || 5000);
app.listen(port, function() {
    console.log('Listening on ' + chalk.underline(chalk.blue('http://0.0.0.0:' + port)));
});

console.log('Call me at ' + chalk.underline(chalk.green(process.env.TWILIO_NUMBER)));