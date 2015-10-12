// requestSchedule.js
// Requests schedule data of specified token
// Created on 11-10-2015
// Status 0

var request = require('request');
var exchangeAppcode = require('./exchangeAppcode.js');
var PushBullet = require('pushbullet');
var pusher = new PushBullet('nCWCoD4saWNZ8YPqlAxCkPnqcFYvgqL5');
var sendPush = require('./sendPush.js');

// exchangeAppcode(process.argv[2], function(token){
//   console.log(token);
// });

var curtime = Math.round((new Date().getTime()) / 1000); // Seconds elapsed since 1-1-1970
var startTime = curtime;
var endTime = startTime + 7*24*60*60;

var token = '9fhdlouud4loe7ou4rjccs1il';
var user = '301259';
var url = 'https://scmoost.zportal.nl/api/v2/appointments?user='+user+'&start='+startTime+'&end='+endTime+'&access_token=' + token;

request(url, function(err, response, body){
  if (!err && response.statusCode == 200){
    console.log('Succesful request');
    var data = JSON.parse(body).response.data;
    for(var i = 0; i < data.length; i++){
      var les = data[i].subjects;
      var leraar = data[i].teachers;
      if(data[i].cancelled == true){
        var title = 'Les vervallen';
        var body = les + ' van ' + leraar + ' is vervallen!'
        sendPush('renzowesterbeek@gmail.com', title, body, 'http://google.com/');
      } else if(data[i].modified == true){
        var title = 'Wijziging voor ' + les + ' van ' + leraar;
        var body = data[i].changeDescription;
        sendPush('renzowesterbeek@gmail.com', title, body, 'http://google.com/');
      }
    }
  } else {
    console.log('Error occured: ' + err);
  }
});
