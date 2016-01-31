/*! iweb-push-server - v1.0.0 - 2016-01-30
* Copyright (c) 2016 ; Licensed  */
var pushServ=require("./pushserv.js"),registerServ=require("./registerserv.js"),firsttimeServ=require("./firsttimeserv.js");pushServ(10),firsttimeServ(10),registerServ(),process.on("SIGINT",function(){console.log("\nShutting down servers..."),process.exit()});