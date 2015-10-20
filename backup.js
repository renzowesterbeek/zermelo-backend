// backup.js
// Backups files every X hours
// Created on 20-10-2015
// Status 0
var fs = require('fs');
var path = require('path');
var ncp = require('ncp');

// backups one file a specified dest folder. function is for async purposes
function backupFile(backupdest, filename){
  fs.readFile(filename, 'utf8', function (err, data) {
    if (err) throw err;
    fs.writeFile(backupdest + filename, data, function (err) {
      if (err) throw err;
      console.log(filename + ' saved!');
    });
  });
}

function zeroFix(num){
  if(num < 10){
    return "0" + num;
  } else {
    return num;
  }
}

setInterval(function(){
  var date = new Date();
  var datestring = date.getFullYear() + "_" + zeroFix(date.getMonth()) + "_" + zeroFix(date.getDate()) + "-" + zeroFix(date.getHours()) + ":" + zeroFix(date.getHours());
  var backupdest = 'backup/' + datestring + '/';

  fs.mkdir('backup/', function(){
    ncp('data/', backupdest, function(err){
      if(err){
        console.log(err);
      } else {
        console.log('Made backup @ ' + datestring);
      }
    });
  });
}, 24 * 60 * 60 * 1000); // every 24 hours
