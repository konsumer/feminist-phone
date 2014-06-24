I really love [Feminist Phone Intervention](http://feminist-phone-intervention.tumblr.com/), but wanted to make my own that runs on other deployment servers easier (I like heroku) and uses nodejs instead of PHP. This is a place-holder for when I have enough time to work on it.

You can call my version at (503) 427-1565.

# quick start (for your own number)

*  Go to [twilio](https://www.twilio.com/) and create a free number
*  Go to [heroku](https://heroku.com/) and create a free host
*  Install [npm](http://nodejs.org/) & [heroku toolbelt](https://toolbelt.heroku.com/)
*  `npm install` on command-line, in this directory
*  `heroku create` on command-line, in this directory
*  `heroku addons:add mongolab` on command-line, in this directory
*  Edit configuration (see configuration section below)
*  Deploy on heroku with `git push heroku master`

## configuration

The app is configured with environment variables. You can edit a file `.env`, or use heroku environment vars (in settings.)

### .env

An example `.env` file looks like this:

```
MONGOLAB_URI=mongodb://<SECRET>

TWILIO_SID=<SECRET>
TWILIO_TOKEN=<SECRET>
TWILIO_NUMBER=5034271565
TWILIO_APP=<SECRET>
```

If you are using heroku, create the initial file, like this: `heroku config:pull --overwrite --interactive`

To push up your twilio config vars from `.env`, use `heroku config:push --overwrite --interactive`


# development

## milestone 1

*  Feature-parity with original
*  basic documentation
*  log texts & calls to mongodb

Here are the features I intend to clone:

*  incoming text responds with Bell Hooks quote
*  incoming call responds with TTS of Bell Hooks quotes or pre-recorded MP3's


## milestone 2

*  output incoming texts/voice for display on site
*  feminist chat AI for honeypotting creepers into wasting their time. Get inspiration from [here](http://www.personalityforge.com/)
*  possibly (mildly) harass incoming texts with periodic texts/calls back
*  good documentation
*  multiple telephony backends (maybe some of the heroku addons for convenience)