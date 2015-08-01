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
  db.users.find({"first_time" : 1}, function(err, docs){
    docs.forEach(function(doc){
      var leerlingnum = doc.leerlingnum;
      pusher.link(doc.email, 'Welkom, je ontvangt vanaf nu notificaties!', 'http://renzo.westerbeek.us/', function(error, response) {
        console.log("Sent welcome notification to", leerlingnum);
      });
      db.users.update({"leerlingnum" : leerlingnum}, {$set: {"first_time" : 0}}, {multi: true}, function(){
        console.log("Updated!");
      });
    });
  });

  db.users.find({"first_time" : 0}, function(err, docs){
    docs.forEach(function(doc){
      scraper(doc.leerlingnum, function(vervallen, gewijzigd){
        if(doc.vervallen !== vervallen && doc.gewijzigd !== gewijzigd){
          // Vervallen & Gewijzigd
          console.log("Vervallen & Gewijzigd");
          db.users.update({"leerlingnum" : doc.leerlingnum}, {$set: {"vervallen" : vervallen, "gewijzigd" : gewijzigd}}, {multi: true}, function(){
            console.log("Updated!");
          });
        } else if (doc.vervallen !== vervallen){
          // Vervallen
          console.log("Vervallen");
          db.users.update({"leerlingnum" : doc.leerlingnum}, {$set: {"vervallen" : vervallen}}, {multi: true}, function(){
            console.log("Updated!");
          });
        } else if (doc.gewijzigd !== gewijzigd){
          // Gewijzigd
          console.log("Gewijzigd");
          db.users.update({"leerlingnum" : doc.leerlingnum}, {$set: {"gewijzigd" : gewijzigd}}, {multi: true}, function(){
            console.log("Updated!");
          });
        }
        // pusher.link(doc.email, 'Welkom, je ontvangt vanaf nu notificaties!', 'http://renzo.westerbeek.us/', function(error, response) {
        //   console.log("Sent welcome notification");
        // });
      });
    });
  });

}, 2 * 1000);
