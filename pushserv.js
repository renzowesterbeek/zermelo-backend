// pushserv.js
// Requests schedule data of specified token
// Created on 11-10-2015
// Status 0
var request = require('request');
var PushBullet = require('pushbullet');
var mongojs = require('mongojs');
var exchangeAppcode = require('./exchangeAppcode.js');
var strtotime = require('./strtotime.js');
var sendPush = require('./sendPush.js');
var pusher = new PushBullet('nCWCoD4saWNZ8YPqlAxCkPnqcFYvgqL5');
var db = mongojs('userdata', ['users']);

function updateSendNotifications(email, id){
  db.users.update({'email':email}, {$push: {already_sent : id}}, function(){
    console.log('Added sent notification');
  });
}

function notificationIsNotSent(email, id, callback){
  db.users.find({'email':email}, function(err, doc){
    if(err){
      console.log(err);
    } else {
      if(doc[0].already_sent.indexOf(id) == -1){
        callback();
      }
    }
  });
}

function retrieveLeerlingnum(token, callback){
  var url = "https://scmoost.zportal.nl/api/v2/users/~me?access_token=" + token;
  request(url, function(err, response, body){
    if(!err & response.statusCode == 200){
      var leerlingnum = JSON.parse(response.body).response.data[0].code;
      callback(null, leerlingnum);
    } else {
      callback(err, null);
    }
  });
}

function retrieveSchedule(email, leerlingnum, token){
  var curtime = Math.round((new Date().getTime()) / 1000); // Seconds elapsed since 1-1-1970
  var startTime = curtime;
  var endTime = strtotime('next saturday', curtime);

  var roosterurl = 'http://lschoonheid.leerik.nl/beta/?id='+leerlingnum;
  var apiurl = 'https://scmoost.zportal.nl/api/v2/appointments?user=~me&start='+startTime+'&end='+endTime+'&access_token='+token+'&valid='+true;

  request(apiurl, function(err, response, body){
    if (!err && response.statusCode == 200){
      console.log('Succesful request');
      var data = JSON.parse(body).response.data;
      for(var i = 0; i < data.length; i++){
        var les = data[i].subjects;
        var leraar = data[i].teachers;
        if(data[i].cancelled === true){
          var title = les + ' van ' + leraar + ' is vervallen!';
          var body = 'Les vervallen!';
          var title = "";
          var id = data[i].id;
          notificationIsNotSent(email, id, function(){
            sendPush(email, title, body, roosterurl);
            updateSendNotifications(email, id);
          });
        } else if(data[i].modified === true){
          var title = 'Wijziging voor ' + les + ' van ' + leraar;
          var body = data[i].changeDescription;
          var id = data[i].id;
          notificationIsNotSent(email, id, function(){
            sendPush(email, title, body, roosterurl);
            updateSendNotifications(email, id);
          });
        }
      }
    } else {
      console.log('Error occured: ' + err);
      db.close();
    }
  });
}

module.exports = function(){
  console.log('Push server started');
  setInterval(function(){
    db.users.find({first_time: 0}, function(err, docs){
      if(err){
        console.log(err);
      } else {
        for(var i = 0; i < docs.length; i++){
          var email = docs[i].email;
          var token = docs[i].token;
          retrieveLeerlingnum(docs[i].token, function(leerlingnum){
            retrieveSchedule(email, leerlingnum, token);
          });
        }
      }
    });
  }, 15 * 60 * 1000);
};
