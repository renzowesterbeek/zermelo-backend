// startbackend.js
// Starts all backend processes for the server to work correctly
// Created on 6-8-15
// Status 2

var pushServ = require('./push.js');
var registerServ = require('./register.js');

//pushServ();
registerServ();
