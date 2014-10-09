# call (503) 427-1565 now!

You can see who has called/texted lately, [here](http://feminist-phone.herokuapp.com/).

I really love [Feminist Phone Intervention](http://feminist-phone-intervention.tumblr.com/). Here is why I made my own:

*  I like javascript better than PHP
*  I like heroku, and I wanted it to be easier to deploy
*  I want this to be a general framework for phone-trolling apps
*  I wanted to make an instructional base for simple express/sockets/AngularJS/twilio telephony app, with realtime updates.
*  I wanted to log calls & texts for maximimum LOL

# support

Help pay for the phone-line by donating to [125ZumCPPxokALadXZZTiVWmVia1KizSFv](https://blockchain.info/address/125ZumCPPxokALadXZZTiVWmVia1KizSFv) bitcoin address. Twilio is pretty cheap, but when more calls roll in, it will get more expensive. I currently spend $20 a month of my own cash, and then it will stop working that month.

# quick start (for your own number)

*  [get a Twilio account](https://www.twilio.com/), not your API key & secret from [your dashboard](https://www.twilio.com/user/account) (at top)
*  [click here](https://heroku.com/deploy?template=https://github.com/konsumer/feminist-phone) to create a heroku machine. Fill in your Twilio API info.

## configuration

The app is configured with environment variables. You can edit a file `.env`, or use heroku environment vars (in settings.) If you don't use the super-easy method above, you will have to mess with this stuff.

### .env

An example `.env` file looks like this:

```
MONGOLAB_URI=mongodb://<SECRET>

TWILIO_SID=<SECRET>
TWILIO_TOKEN=<SECRET>
```


# development

## milestone 1

*  Feature-parity with original
*  [X] basic documentation
*  [X] log texts & calls to mongodb
*  [X] output incoming texts/voice for display on site

Here are the features I intend to clone:

*  [X] incoming text responds with text quotes
*  [X] incoming call responds with TTS of text quotes
*  [ ] incoming call responds with pre-recorded MP3's


## milestone 2

*  feminist chat AI for honeypotting creepers into wasting their time. Get inspiration from [here](http://www.personalityforge.com/)
*  (mildly) harass incoming texts with periodic texts/calls back
*  good documentation
*  multiple telephony backends (maybe some of the heroku addons for convenience)
*  quote admin interface: so you can set the quotes easily.
*  when texts come in, send them to other people that already sent texts
*  option to store voicemails on S3 when they come in, so they don't disappear