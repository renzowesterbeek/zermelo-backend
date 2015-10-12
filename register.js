// register.js
// Handles submitted registration forms
// Created on 2-8-15

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongojs = require('mongojs');
var db = mongojs('userdata', ['users']);
var exchangeAppcode = require('./exchangeAppcode.js');

function insertDoc(email, token, callback){
  db.users.insert({
    'email' : email,
    'token' : token,
    'first_time' : 1,
    'alread_sent' : []
  }, callback);
}

function emailExists(email){
  db.users.find({'email':email}, function(err, doc){
    if(!err){
      console.log(doc);
      db.close();
    } else {
      console.log('ERROR:', err);
      db.close();
    }
  });
}

// Export register.js module
module.exports = function(){
  app.use(bodyParser.urlencoded({
    extended: true
  }));

  app.post('/register', function(req, res) {
      var appcode = req.body.appcode;
      var email = req.body.email;
      console.log("REGISTRATION DATA:", email, appcode);
      if(emailExists(email) == 1){
        res.redirect("http://localhost/iweb-push-server/register.php?m=Email already in use");
      } else {
        res.redirect("http://localhost/iweb-push-server/register.php?m=succes");
      }

      res.end();

      // exchangeAppcode(appcode, function(err, token){
      //   if(err){
      //     console.log('ERROR:', err);
      //     res.redirect("http://localhost/iweb-push-server/register.php?m=" + err);
      //   } else {
      //     console.log("TOKEN:", token);
      //
      //     // insertDoc(email, token, function(){
      //     //   console.log('Inserted');
      //     //   db.close();
      //     //   res.redirect("http://localhost/iweb-push-server/register.php?m=Succesful%20registration");
      //     // })
      //   }
      // });
  });

  var server = app.listen(3000, function () {
    console.log('Register Server listening on port 3000');
  });
}
