// startbackend.js
// Starts all backend processes for the server to work correctly
// Created on 6-8-15
// Status 1
var pushServ = require('./pushserv.js');
var registerServ = require('./registerserv.js');

pushServ();
registerServ();

process.on( 'SIGINT', function() {
  console.log( "\nShutting down servers..." );
  // some other closing procedures go here
  process.exit( );
})
