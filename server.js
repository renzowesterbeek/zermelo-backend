var scraper = require('./scraper.js');
var mongojs = require('mongojs');
var PushBullet = require('pushbullet');
var pusher = new PushBullet('nCWCoD4saWNZ8YPqlAxCkPnqcFYvgqL5');

var url = 'mongodb://localhost:27017/iweb';
var db = mongojs(url, ["users"]);

setInterval(function(){
  db.users.find({"first_time" : 1}, function(err, docs){
    docs.forEach(function(doc){
      var leerlingnum = doc.leerlingnum;
      pusher.link(doc.email, 'Welkom, je ontvangt vanaf nu notificaties!', 'http://renzo.westerbeek.us/', function(error, response) {
        console.log("Sent welcome notification");
      });
      db.users.update({"leerlingnum" : leerlingnum}, {"first_time" : 0}, function(){
        console.log("Updated!");
      });
    });
  });

  db.users.find({"first_time" : 0}, function(err, docs){
    pusher.link(doc.email, 'Welkom, je ontvangt vanaf nu notificaties!', 'http://renzo.westerbeek.us/', function(error, response) {
      console.log("Sent welcome notification");
    });
    // scraper(leerlingnum, function(vervallen, gewijzigd){
    //   console.log(leerlingnum, vervallen, gewijzigd);
    // });
  });

}, 2 * 1000);

// var bulk = db.users.initializeOrderedBulkOp();
// bulk.find({}).remove();
// bulk.execute(function (err, res) {
//   console.log('Done!');
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
