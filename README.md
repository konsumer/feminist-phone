I really love [Feminist Phone Intervention](http://feminist-phone-intervention.tumblr.com/), but wanted to make my own that runs on other deployment servers easier (I like heroku) and uses nodejs instead of PHP & logs incoming calls/texts for LOLs.

You can call my version at (503) 427-1565. You can see who has called/texted lately, [here](http://feminist-phone.herokuapp.com/).

# support

Help pay for the phone-line by donating to [125ZumCPPxokALadXZZTiVWmVia1KizSFv](https://blockchain.info/address/125ZumCPPxokALadXZZTiVWmVia1KizSFv) bitcoin address. Twilio is pretty cheap, but when more calls roll in, it will  get more expensive. I currently spend about $20 a month of my own cash.

# quick start (for your own number)

*  Go to [twilio](https://www.twilio.com/) and create a free number, look for your SID & TOKEN in your dashboard, and set them in your [configuration](#configuration) (see below)
*  Go to [heroku](https://heroku.com/) and create a free host
*  Install [npm](http://nodejs.org/) & [heroku toolbelt](https://toolbelt.heroku.com/)
*  `npm install` on command-line, in this directory
*  `heroku create` on command-line, in this directory
*  `heroku addons:add mongolab` on command-line, in this directory
*  Edit configuration (see [configuration](#configuration) section below)
*  Deploy on heroku with `git push heroku master`

## configuration

The app is configured with environment variables. You can edit a file `.env`, or use heroku environment vars (in settings.)

### .env

An example `.env` file looks like this:

```
MONGOLAB_URI=mongodb://<SECRET>

TWILIO_SID=<SECRET>
TWILIO_TOKEN=<SECRET>
```

If you are using heroku, create the initial file, like this: `heroku config:pull --overwrite --interactive`

To push up your twilio config vars from `.env`, use `heroku config:push --overwrite --interactive`


# development

## milestone 1

*  Feature-parity with original
*  basic documentation
*  log texts & calls to mongodb
*  output incoming texts/voice for display on site

Here are the features I intend to clone:

*  incoming text responds with Bell Hooks quote
*  incoming call responds with TTS of Bell Hooks quotes or pre-recorded MP3's


## milestone 2

*  feminist chat AI for honeypotting creepers into wasting their time. Get inspiration from [here](http://www.personalityforge.com/)
*  possibly (mildly) harass incoming texts with periodic texts/calls back
*  good documentation
*  multiple telephony backends (maybe some of the heroku addons for convenience)
*  quote admin interface: so you can set the quotes easily.