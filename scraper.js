// scraper.js
// Data-scraper module for the InfoWeb website
// Created on 31-7-2015
// Status 

var cheerio = require("cheerio");
var http = require("http");

function getBody(url, callback){
  http.get(url, function(res) {
    if(res.statusCode == 200){
      var data = "";
      res.on("data", function(chunk) {
        data += chunk;
      });
      res.on("end", function(){
        callback(data);
      });
    }
    res.on('error', function(e) {
      console.log("Got error: " + e.message);
      return 0;
    });
  });
}

module.exports = function(leerlingnum, callback){
  var url = "http://localhost/InfoWeb.html?ref=2&id=" + leerlingnum;

  getBody(url, function(body){
    var $ = cheerio.load(body);

    var vervallen = 0;
    $(".vervallen").each(function(){
      vervallen += 1;
    });

    var gewijzigd = 0;
    $(".wijziging").each(function(){
      gewijzigd += 1;
    });

    callback(vervallen, gewijzigd);
  });

};
