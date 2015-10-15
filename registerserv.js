// register.js
// Handles submitted registration forms
// Created on 2-8-15
// Status 1
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongojs = require('mongojs');
var db = mongojs('userdata', ['users']);
var exchangeAppcode = require('./exchangeAppcode.js');

// Inserts account in db
function insertDoc(email, token, callback){
  db.users.insert({
    'email' : email,
    'token' : token,
    'first_time' : 1,
    'already_sent' : []
  }, callback);
}

// Checks whether email adress exists in db or not
function emailExists(email, callback){
  db.users.find({'email':email}, function(err, doc){
    if(err){
      console.log(err);
      db.close();
    } else {
      if(doc.length == 0){
        callback(0);
      } else {
        callback(1);
      }
    }
  });
}
// 755 012 741 291

// Export register.js module
module.exports = function(){
  app.use(bodyParser.urlencoded({
    extended: true
  }));

  app.post('/register', function(req, res) {
      var appcode = req.body.appcode;
      var email = req.body.email;
      console.log("REGISTRATION DATA:", email, appcode);

      emailExists(email, function(result){
        if(result == 0){
          // Start registration
          exchangeAppcode(appcode, function(err, token){
            if(err){
              console.log('ERROR:', err);
              res.redirect("http://localhost/iweb-website/dist/?m=" + err);
            } else {
              insertDoc(email, token, function(){
                console.log('Inserted');
                db.close();
                res.redirect("http://localhost/iweb-website/dist/?m=Succesful%20registration");
              })
            }
          });
        } else {
          res.redirect("http://localhost/iweb-website/dist/?m="+email+" already in use&appcode=" + appcode);
        }
      });
  });

  var server = app.listen(3000, function () {
    console.log('Registeration server started on port 3000');
  });
}
