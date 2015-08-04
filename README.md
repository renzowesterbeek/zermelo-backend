# InfoWeb Server (backend)
v0.1.0 - Running

[NodeJS]("http://www.nodejs.org/")-based push-notification server for my [InfoWeb Notification System]("https://github.com/renzowesterbeek/iweb-website")
This server handles all changes on the [InfoWeb website]("http://cygyrooster.nl/infoweb/index.php?ref=2") and pushes notifications regarding this changes to the user using [Pushbullet]("https://www.pushbullet.com").

## What is InfoWeb?
_InfoWeb is the schedule system my school uses. I'm creating a service that sends notifications to students when their schedule changes._

## Used Technologies
- [NodeJS]("http://www.nodejs.org/") - Web-scraping and server
- [Express]("http://expressjs.com/") - Middleware for registering
- [MongoDB]("http://mongodb.org") - Database
- [Pushbullet]("https://www.pushbullet.com") - Push notifications

## Todo
- [ ] Check for existance of leerlingnummer or email in database
- [ ] Create server-running script to run all Node servers in one click
- [x] Send notification on 'wijziging' and 'vervallen'
- [x] Add 'leerlingnummer' to log-system
