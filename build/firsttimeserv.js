/*! iweb-push-server - v0.1.0 - 2015-10-18
* Copyright (c) 2015 ; Licensed  */
var PushBullet=require("pushbullet"),mongojs=require("mongojs"),sendPush=require("./sendPush.js"),pusher=new PushBullet("nCWCoD4saWNZ8YPqlAxCkPnqcFYvgqL5"),db=mongojs("userdata",["users"]);module.exports=function(interval){console.log("Firsttime server started"),setInterval(function(){db.users.find({first_time:1},function(err,docs){if(err)console.log(err);else for(var i=0;i<docs.length;i++){var email=docs[i].email;sendPush(email,"Zermelo notificaties","Je ontvangt vanaf nu notificaties voor je rooster!","http://renzo.westerbeek.us/rooster"),db.users.update({email:email},{$set:{first_time:0}},function(){console.log("First_time updated for",email)})}})},1e3*interval)};