var MongoClient = require('mongodb').MongoClient;
// Connect to the db
MongoClient.connect("mongodb://127.0.0.1/mydb", function(err, db) {
if(!err) {
    console.log("We are connected");
}
else
	db.close()
});


 /*********Get Cloud Foundry credentials to connect mongodb*************/
 var vcapServices = require('vcap_services');
 var MongoClient = require('mongodb').MongoClient;
 let url;
 var credentials = vcapServices.getCredentials('mlab');
 url=credentials.uri;
 //If Cloud Foundry credentials are not available then ***********//
 //get local DOCKER running mongo server credintials ************//
 if (url==null)
    url="mongodb://mongo:27017/mynewdb";

 // Connect to the db
 MongoClient.connect(url, function (err, db) {
 if (!err)
    console.log("We are connected",url);
 else
    console.log("Not Connected",url)
 })