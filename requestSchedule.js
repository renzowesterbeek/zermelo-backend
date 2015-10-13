// requestSchedule.js
// Requests schedule data of specified token
// Created on 11-10-2015
// Status 0

var request = require('request');
var exchangeAppcode = require('./exchangeAppcode.js');
var PushBullet = require('pushbullet');
var pusher = new PushBullet('nCWCoD4saWNZ8YPqlAxCkPnqcFYvgqL5');
var sendPush = require('./sendPush.js');
var mongojs = require('mongojs');
var db = mongojs('userdata', ['users']);

function updateSendNotifications(email, id){
  db.users.update({'email':email}, {$push: {already_sent : id}}, function(){
    console.log('Added sent notification');
    db.close();
  });
}

function notificationIsSent(email, id, callback){
  db.users.find({'email':email}, function(err, doc){
    if(err){
      console.log(err);
    } else {
      if(doc[0].already_sent.indexOf(id) == -1){
        callback();
      }
      db.close();
    }
  });
}

var curtime = Math.round((new Date().getTime()) / 1000); // Seconds elapsed since 1-1-1970
var startTime = curtime;
//var endTime = startTime + 7*24*60*60; // adds a week
var endTime = Math.round((new Date('Sat Oct 17 2015').getTime()) / 1000);
console.log(new Date(endTime*1000));

var token = '9fhdlouud4loe7ou4rjccs1il';
var user = '301259';
var email = 'renzowesterbeek@gmail.com';
var roosterurl = 'http://lschoonheid.leerik.nl/beta/?id='+user;
var apiurl = 'https://scmoost.zportal.nl/api/v2/appointments?user='+user+'&start='+startTime+'&end='+endTime+'&access_token='+token+'&valid='+true;
console.log(apiurl);

request(apiurl, function(err, response, body){
  if (!err && response.statusCode == 200){
    console.log('Succesful request');
    var data = JSON.parse(body).response.data;
    for(var i = 0; i < data.length; i++){
      var les = data[i].subjects;
      var leraar = data[i].teachers;
      if(data[i].cancelled == true){
        var title = les + ' van ' + leraar + ' is vervallen!';
        var body = 'Les vervallen!';
        var title = "";
        notificationIsSent(email, data[i].id, function(){
          sendPush(email, title, body, roosterurl);
          updateSendNotifications(email, data[i].id);
        });
      } else if(data[i].modified == true){
        var title = 'Wijziging voor ' + les + ' van ' + leraar;
        var body = data[i].changeDescription;
        var id = data[i].id;
        notificationIsSent(email, data[i].id, function(){
          sendPush(email, title, body, roosterurl);
          updateSendNotifications(email, id);
        });
      }
    }
  } else {
    console.log('Error occured: ' + err);
  }
});
