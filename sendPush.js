// sendPush.js
// Sends pushnotification with specified title, body and url to email
// Created on 11-10-2015
// Status 2

var request = require('request');

module.exports = function (email, title, body, roosterurl){
  request.post({
    url : 'https://api.pushbullet.com/v2/pushes',
    headers : {
      'Access-Token' : 'nCWCoD4saWNZ8YPqlAxCkPnqcFYvgqL5',
      'Content-Type' : 'application/json'
    },
    form : {
      'email' : email,
      'type' : 'link',
      'title' : title,
      'body' : body,
      'url' : roosterurl
    }
  }, function(err, httpResponse, body){
    if(!err){
      console.log('SENT', email, title);
    } else {
      console.log('ERROR', err);
    }
  });
};
