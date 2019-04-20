var settings = require('../settings'); 
var Db = require('mongodb').Db; 
var Connection = require('mongodb').Connection; 
var Server = require('mongodb').Server; 
 
module.exports = new Db(settings.db, new Server(settings.host, 20127,{auto_reconnect:true,poolSize:20}),{w:1});
//module.exports = new Db(settings.db, new Server(settings.host, Connection.DEFAULT_PORT,{auto_reconnect:true,poolSize:20}),{w:1});