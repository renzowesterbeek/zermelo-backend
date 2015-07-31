var scraper = require('./scraper.js');

scraper("301250", function(vervallen, gewijzigd){
  console.log(vervallen, gewijzigd);
});
