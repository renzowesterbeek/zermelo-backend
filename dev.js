// dev.js
// Some general functions used for development purposes
// Created on 1-8-2015
var mongojs = require('mongojs');

var db = mongojs('mongodb://localhost:27017/iweb', ["users"]);

function clearDB(){
  var bulk = db.users.initializeOrderedBulkOp();
  bulk.find().remove();
  bulk.execute(function (err, res) {
    console.log('Cleared db');
  });
}

function insert(){
  db.users.insert({
    "name" : "Renzo Westerbeek",
    "password" : "",
    "leerlingnum" : "301250",
    "email" : "renzowesterbeek@gmail.com",
    "vervallen" : 0,
    "gewijzigd" : 0,
    "first_time" : 1
  }, function(){
    console.log("Done Inserting");
  });
}

function logEntries(){
  db.users.find(function(err, docs){
    console.log(docs);
    db.close();
  });
}
