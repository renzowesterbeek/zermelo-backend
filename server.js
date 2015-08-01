// server.js
// Connects all components of the server. This file is run by node and calls other modules
// Created on 31-7-2015

var scraper = require('./scraper.js');
var mongojs = require('mongojs');
var PushBullet = require('pushbullet');
var pusher = new PushBullet('nCWCoD4saWNZ8YPqlAxCkPnqcFYvgqL5');

var url = 'mongodb://localhost:27017/iweb';
var db = mongojs(url, ["users"]);

// var bulk = db.users.initializeOrderedBulkOp();
// bulk.find().remove();
// bulk.execute(function (err, res) {
//   console.log('Cleared db');
// });

// db.users.insert({
//   "name" : "Renzo Westerbeek",
//   "password" : "",
//   "leerlingnum" : "301250",
//   "email" : "renzowesterbeek@gmail.com",
//   "vervallen" : 0,
//   "gewijzigd" : 0,
//   "first_time" : 1
// }, function(){
//   console.log("Done Inserting");
// });

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
            console.log("Sent uitval en verval-notification to: ", doc.leerlingnum);
          });
          db.users.update({"leerlingnum" : doc.leerlingnum}, {$set: {"vervallen" : vervallen, "gewijzigd" : gewijzigd}}, {multi: true}, function(){});
        } else if (doc.vervallen !== vervallen){
          // Vervallen
          pusher.link(doc.email, 'Je hebt uitval!', roosterurl, function(error, response) {
            console.log("Sent uitval-notification to: ", doc.leerlingnum);
          });
          db.users.update({"leerlingnum" : doc.leerlingnum}, {$set: {"vervallen" : vervallen}}, {multi: true}, function(){});
        } else if (doc.gewijzigd !== gewijzigd){
          // Gewijzigd
          pusher.link(doc.email, 'Je hebt een niewe roosterwijziging!', roosterurl, function(error, response) {
            console.log("Sent wijziging-notification to: ", doc.leerlingnum);
          });
          db.users.update({"leerlingnum" : doc.leerlingnum}, {$set: {"gewijzigd" : gewijzigd}}, {multi: true}, function(){});
        }

      });
    });
  });

}, 2 * 1000);
