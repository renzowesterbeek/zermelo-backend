var request = require("request");
var cheerio = require("cheerio");

module.exports = function(leerlingnum){
  var url = "http://localhost/InfoWeb.html?ref=2";

  request({
    uri: url + "&id=" + leerlingnum,
  }, function(error, response, body) {
    var $ = cheerio.load(body);

    var vervallen = 0;
    $(".vervallen").each(function(){
      vervallen += 1;
    });

    var gewijzigd = 0;
    $(".wijziging").each(function(){
      gewijzigd += 1;
    });
    console.log(vervallen, gewijzigd);
  });
}
