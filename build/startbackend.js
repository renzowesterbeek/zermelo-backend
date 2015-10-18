/*! iweb-push-server - v0.1.0 - 2015-10-18
* Copyright (c) 2015 ; Licensed  */
var pushServ=require("./pushserv.js"),registerServ=require("./registerserv.js"),firsttimeServ=require("./firsttimeserv.js");pushServ(900),firsttimeServ(10),registerServ(),process.on("SIGINT",function(){console.log("\nShutting down servers..."),process.exit()});