// pushserv.js
// Requests schedule data of specified token
// Created on 11-10-2015
// Status 1
var request = require('request');
var mongojs = require('mongojs');
var exchangeAppcode = require('./exchangeAppcode.js');
var strtotime = require('./strtotime.js');
var sendPush = require('./sendPush.js');
var db = mongojs('userdata', ['users']);

function notificationIsNotSent(scheduledoc, email, callback){
  db.users.find({'email':email}, function(err, doc){
    if(err){
      console.log(err);
      sendPush.admin('pushserv.js', err);
    } else {
      if(doc[0].already_sent.indexOf(scheduledoc.id) == -1){
        // Adds notification id to user's array
        db.users.update({'email':email}, {$push: {already_sent : scheduledoc.id}}, function(){
          console.log('ADD', scheduledoc.id, 'to', email);
          callback(scheduledoc.subjects, scheduledoc.teachers, scheduledoc.changeDescription, convertToDay(scheduledoc.start));
        });
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
      sendPush.admin('pushserv.js', err);
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
  var startTime = curtime;
  var endTime = strtotime('next saturday', startTime);

  var roosterurl = 'http://lschoonheid.leerik.nl/beta/?id='+leerlingnum;
  var apiurl = 'https://scmoost.zportal.nl/api/v2/appointments?user=~me&start='+startTime+'&end='+endTime+'&access_token='+token+'&valid='+true;

  request(apiurl, function(err, response, body){
    if (!err && response.statusCode == 200){
      console.log('Succesful request');
      var data = JSON.parse(body).response.data;
      for(var i = 0; i < data.length; i++){
        if(data[i].cancelled === true){
          notificationIsNotSent(data[i], email, function(les, leraar, omschrijving, dag){
            var title = les + ' op ' + dag + ' is vervallen!';
            var body = 'Les vervallen!';
            sendPush.user(email, title, body, roosterurl);
          });
        } else if(data[i].modified === true){
          notificationIsNotSent(data[i], email, function(les, leraar, omschrijving, dag){
            var title = 'Wijziging voor ' + les + ' op ' + dag;
            var body = omschrijving;
            sendPush.user(email, title, body, roosterurl);
          });
        }
      }
    } else {
      console.log('Error occured: ' + err);
      sendPush.admin('pushserv.js', err);
    }
  });
}

module.exports = function(interval){
  console.log('Push server started');
  setInterval(function(){
    db.users.find({first_time: 0}, function(err, docs){
      if(err){
        console.log(err);
        sendPush.admin('pushserv.js', err);
      } else {
        for(var i = 0; i < docs.length; i++){
          var email = docs[i].email;
          var token = docs[i].token;
          retrieveLeerlingnum(token, function(err, leerlingnum){
            retrieveSchedule(email, leerlingnum, token);
          });
        }
      }
    });
  }, interval * 1000);
};
