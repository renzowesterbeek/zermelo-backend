// firsttimeserv.js
// Sends update to first-time users
// Created on 14-10-2015
// Status OBSOLETE
var PushBullet = require('pushbullet');
var mongojs = require('mongojs');
var sendPush = require('./sendPush.js');
var pusher = new PushBullet('nCWCoD4saWNZ8YPqlAxCkPnqcFYvgqL5');
var db = mongojs('userdata', ['users']);

module.exports = function(interval){
  console.log('Firsttime server started');
  setInterval(function(){
    db.users.find({first_time:1}, function(err, docs){
      if(err){
        console.log(err);
      } else {
        for(var i = 0; i < docs.length; i++){
          var email = docs[i].email;
          sendPush.user(email, 'Zermelo notificaties', 'Je ontvangt vanaf nu notificaties voor je rooster!', 'http://renzo.westerbeek.us/rooster');
          db.users.update({email:email}, {$set: {first_time: 0}}, function(){
            console.log('First_time updated for', email);
          });
        }
      }
    });
  }, interval * 1000);
};
