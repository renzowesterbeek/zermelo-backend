// exchangeAppcode.js
// Exchanges Zermelo appcode for permanent token
// Created on 10-10-2015
// Status 1
var request = require('request');

module.exports = function(appcode, callback){
  if(!appcode){
    console.log("Please submit appcode");
    return 0;
  }
  appcode = appcode.replace(/\s/g, ''); // remove whitespace
  var streek = 'scmoost';
  var url = 'https://'+ streek +'.zportal.nl/api/v2/oauth/token';
  var data = {
    "grant_type" : "authorization_code",
    "code" : appcode
  };

  // Send post request
  request.post({url:url, formData: data}, function(err, httpResponse, body) {
    if (err) {
      return console.error('POST FAILED:', err);
    }
    if(body.indexOf('HTTP Status 404') >= 0){
      callback('Streek incorrect', null);
    } else if(body.indexOf('HTTP Status 400') >= 0){
      callback('Code is al gebruikt', null);
    } else {
      var jsonBody = JSON.parse(body);
      // console.log('Expires in: ' + jsonBody.expires_in);
      callback(null, jsonBody.access_token);
    }
  });

}
