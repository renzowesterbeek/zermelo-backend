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
      console.log(id, doc[0].already_sent);
      console.log("INDEX: " + doc[0].already_sent.indexOf(id));
      if(doc[0].already_sent.indexOf(id) == -1){
       callback(true);
       updateSendNotifications(email, id);
     } else {
       callback(false);
       updateSendNotifications(email, id);
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

function convertToDay(seconds){
  var day = new Date(seconds * 1000).getDay();
  if(day == 1){
    return 'maandag';
  } else if(day == 2){
    return 'dinsdag';
  } else if(day == 3){
    return 'woensdag';
  } else if(day == 4){
    return 'donderdag';
  } else if(day == 5){
    return 'vrijdag';
  } else {
    return day;
  }
}

function retrieveSchedule(email, leerlingnum, token){
  var curtime = Math.round((new Date().getTime()) / 1000); // Seconds elapsed since 1-1-1970
  //var startTime = curtime;
  //var endTime = strtotime('next saturday', curtime);
  var startTime = 1445835600;
  var endTime = 1446267600;

  var roosterurl = 'http://lschoonheid.leerik.nl/zermelo/alpha/?id='+leerlingnum;
  var apiurl = 'https://scmoost.zportal.nl/api/v2/appointments?user=~me&start='+startTime+'&end='+endTime+'&access_token='+token+'&valid='+true;
  console.log(apiurl);
  request(apiurl, function(err, response, body){
    if (!err && response.statusCode == 200){
      console.log('Succesful request');
      var data = JSON.parse(body).response.data;
      for(var i = 0; i < data.length; i++){
        var les = data[i].subjects;
        var leraar = data[i].teachers;
        if(data[i].cancelled === true){
          var title = les + ' op ' + convertToDay(data[i].start * 1000) + ' is vervallen!';
          var body = 'Les vervallen!';
          var id = data[i].id;
          notificationIsNotSent(email, id, function(){
            //sendPush(email, title, body, roosterurl);
            //updateSendNotifications(email, id);
          });
        } else if(data[i].modified === true){
          var title = 'Wijziging voor ' + les + ' op ' + convertToDay(data[i].start * 1000);
          var body = data[i].changeDescription;
          var id = data[i].id;
          notificationIsNotSent(email, id, function(value){
            if(value == true){
              //updateSendNotifications(email, id);
              sendPush(email, title, body, roosterurl);
            }
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
          retrieveLeerlingnum(token, function(err, leerlingnum){
            if(!err){
              console.log('retrieving');
              retrieveSchedule(email, leerlingnum, token);
            } else {
              console.log(err);
            }
          });
        }
      }
    });
  }, 5 * 1000);
};
