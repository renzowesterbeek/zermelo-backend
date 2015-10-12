// dev.js
// Some general functions used for development purposes
// Created on 1-8-2015
var mongojs = require('mongojs');

var db = mongojs('userdata', ['users']);

function clearDB(){
  db.users.remove(function(){
    db.close();
  });
}

function insertDoc(email, appcode){
  db.users.insert({'email' : email, 'appcode' : appcode}, function(){
    db.close();
  });
}

db.users.find(function(err, doc){
  if(!err){
    console.log(doc);
  } else {
    console.log(err);
  }
  db.close();
});
