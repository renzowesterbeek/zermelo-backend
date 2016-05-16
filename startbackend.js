// startbackend.js
// Starts all backend processes for the server to work correctly
// Created on 6-8-15
// Status 2
var pushServ = require('./pushserv.js');
var registerServ = require('./registerserv.js');
var firsttimeServ = require('./firsttimeserv.js');

// Intervals in seconds
pushServ(10);
registerServ(/* is called every time user registers */);

// Called on stopping of servers (ctrl-c)
process.on('SIGINT', function() {
  console.log("\nShutting down servers...");
  // Exit procedures here
  process.exit();
});
