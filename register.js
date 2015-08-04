// register.js
// Handles submitted registration forms
// Created on 2-8-15

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongojs = require('mongojs');
var db = mongojs('mongodb://localhost:27017/iweb', ["users"]);

app.use(bodyParser.urlencoded({
  extended: true
}));

app.post('/register', function(req, res) {
    var leerlingnum = req.body.leerlingnum;
    var email = req.body.email;
    console.log("REGISTRATION DATA:", leerlingnum, email);

    // db.users.insert({
    //   "leerlingnum" : leerlingnum,
    //   "email" : email,
    //   "vervallen" : 0,
    //   "gewijzigd" : 0,
    //   "first_time" : 1
    // }, function(){
    //   console.log("Done Inserting");
    //   res.redirect("http://localhost/iweb-website/succes.html");
    // });
    //res.end("Registered, <a href='http://localhost/iweb-website/index.html'>Go back</a>");
    res.redirect("http://localhost/iweb-website/dist/");
});

var server = app.listen(3000, function () {
  console.log('Register Server listening on port 3000');
});
