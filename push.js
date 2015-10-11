// server.js
// Handles sending of push-notifications. Listens for new schedule-changes
// Created on 31-7-2015
// Status 

// Start mongodb server with this command: mongod --dbpath=./userdata

// Require statements
var mongojs = require('mongojs');
var PushBullet = require('pushbullet');
var scraper = require('./scraper.js');
var pusher = new PushBullet('nCWCoD4saWNZ8YPqlAxCkPnqcFYvgqL5');

// Init database
var db = mongojs('mongodb://localhost:27017/iweb', ["users"]);

// Export push.js module
module.exports = function main(){
  console.log("Push-server listening for updates...");
  setInterval(function(){
    // Check for first-time users
    db.users.find({"first_time" : 1}, function(err, docs){
      docs.forEach(function(doc){
        var leerlingnum = doc.leerlingnum;
        pusher.link(doc.email, 'Welkom, je ontvangt vanaf nu notificaties!', 'http://renzo.westerbeek.us/', function(error, response) {
          console.log("Sent welcome notification to", leerlingnum);
        });
        db.users.update({"leerlingnum" : leerlingnum}, {$set: {"first_time" : 0}}, {multi: true}, function(){});
      });
    });

    // Check for change on all users
    db.users.find({"first_time" : 0}, function(err, docs){
      docs.forEach(function(doc){
        scraper(doc.leerlingnum, function(vervallen, gewijzigd){
          var roosterurl = "http://lschoonheid.leerik.nl/beta/clean/iweb+/?ref=2&id=" + doc.leerlingnum;
          if(doc.vervallen !== vervallen && doc.gewijzigd !== gewijzigd){
            // Vervallen & Gewijzigd
            console.log("Vervallen & Gewijzigd voor", doc.leerlingnum);
            pusher.link(doc.email, 'Je hebt uitval en een nieuwe wijziging', roosterurl, function(error, response) {
              console.log("Sent uitval en verval-notification to:", doc.leerlingnum);
            });
            db.users.update({"leerlingnum" : doc.leerlingnum}, {$set: {"vervallen" : vervallen, "gewijzigd" : gewijzigd}}, {multi: true}, function(){});
          } else if (doc.vervallen !== vervallen){
            // Vervallen
            pusher.link(doc.email, 'Je hebt uitval!', roosterurl, function(error, response) {
              console.log("Sent uitval-notification to:", doc.leerlingnum);
            });
            db.users.update({"leerlingnum" : doc.leerlingnum}, {$set: {"vervallen" : vervallen}}, {multi: true}, function(){});
          } else if (doc.gewijzigd !== gewijzigd){
            // Gewijzigd
            pusher.link(doc.email, 'Je hebt een niewe roosterwijziging!', roosterurl, function(error, response) {
              console.log("Sent wijziging-notification to:", doc.leerlingnum);
            });
            db.users.update({"leerlingnum" : doc.leerlingnum}, {$set: {"gewijzigd" : gewijzigd}}, {multi: true}, function(){});
          }

        });
      });
    });

  }, 2 * 1000);
}
