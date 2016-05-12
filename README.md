# Zermelo Push Server (backend)
Status:
- register-serv   - stable
- push-serv       - stable
- firsttime-serv  - stable

[NodeJS]("http://www.nodejs.org/")-based push-notification and registration server for my [Zermelo Notification System]("https://github.com/renzowesterbeek/iweb-website")
This server handles all changes on the [Zermelo website]("http://scmoost.zportal.nl") and pushes notifications regarding this changes to the user using [Pushbullet]("https://www.pushbullet.com").

## What is Zermelo?
_Zermelo is the scheduling system my school uses. I'm creating a service that sends notifications to students when their schedule changes._

## Used Technologies
- [NodeJS](http://www.nodejs.org/) - Connecting to Zermelo api and server
- [Express](http://expressjs.com/) - Middleware for registering
- [MongoDB](http://mongodb.org) - Database
- [Pushbullet](https://www.pushbullet.com) - Push notifications

## Todo
- [ ] Create admin page
- [x] Create errror notification system
- [x] Implement display of day of schedule change

## How To
_Starting the backend_

1. Launch MongoDB `mongod --dbpath=data/db`
2. Start servers `node build/startbackend.js`

_Monitoring db_

1. Connect to server using `mongo`
2. Switch to db userdata using `use userdata`
2. Find registered users and their data using `db.users.find()`
