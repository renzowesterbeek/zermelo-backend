// viewdb.js
// Logs all database entries in selevted database
// Created on 31-7-2015

var mongojs = require('mongojs');

var url = 'mongodb://localhost:27017/iweb';
var db = mongojs(url, ["users"]);

db.users.find(function(err, docs){
  console.log(docs);
  db.close();
});
