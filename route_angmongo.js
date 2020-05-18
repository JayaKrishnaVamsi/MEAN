var express = require('express');  
var bodyParser = require('body-parser'); 
var ejs = require('ejs');
var MongoClient = require('mongodb').MongoClient;
var app = express();  
var urlencodedParser = bodyParser.urlencoded({ extended: false })
// Connect to the db

MongoClient.connect("mongodb://127.0.0.1/mynewdb", function(err, db) {
 if(!err) {
    console.log("We are connected");

app.use(express.static('public')); //making public directory as static directory  
app.use(bodyParser.json());


app.get('/about.html', function (req, res) {  
   console.log("Got a GET request for /about.html");  
   res.sendFile( __dirname + "/" + "about.html" );
})  
/*JS client side files has to be placed under a folder by name 'public' */

app.get('/index.html', function (req, res) {  
   res.sendFile( __dirname + "/" + "index.html" );    
})  



app.get('/insert.html', function (req, res) {
    res.sendFile( __dirname + "/" + "insert.html" );
})
/* to access the posted data from client using request body (POST) or request params(GET) */
//-----------------------POST METHOD-------------------------------------------------
app.post('/process_post', function (req, res) {
    /* Handling the AngularJS post request*/
    console.log(req.body);
	res.setHeader('Content-Type', 'text/html');
    req.body.serverMessage = "NodeJS replying to angular"
        /*adding a new field to send it to the angular Client */
		console.log("Sent data are (POST): Contact Number :"+req.body.number+" Contact Name="+req.body.name);
		// Submit to the DB
  	var number = req.body.number;
	var name = req.body.name;
	var email= req.body.email;
	var city=  req.body.city;
	//To avoid duplicate entries in MongoDB
	db.collection('contacts').createIndex({"number":1},{unique:true});
	/*response has to be in the form of a JSON*/
	db.collection('contacts').insertOne({number:number,name:name,email:email,city:city}, (err, result) => {                       
                    if(err) 
					{ 
						console.log(err.message); 
						res.send("Duplicate Contact Number")
					} 
					else
					{
                    console.log('Contact Inserted');
					/*Sending the respone back to the angular Client */
					res.end("Contact Inserted-->"+JSON.stringify(req.body));
					}
                })      
	
    });
//--------------------------GET METHOD-------------------------------
app.get('/process_get', function (req, res) { 
// Submit to the DB
  var newEmp = req.query;
	var number = req.query['number'];
	var name = req.query['name'];
	var email = req.query['email'];
	var city = req.query['city'];
	db.collection('contacts').createIndex({"number":1},{unique:true});
	db.collection('contacts').insertOne({number:number,name:name,email:email,city:city}, (err, result) => {                       
                    if(err) 
					{ 
						console.log(err.message); 
						res.send("Duplicate Contact Number")
					} 
					else
					{
                    console.log("Sent data are (GET): Number :"+number+" Contact name :"+name);
					/*Sending the respone back to the angular Client */
					res.end("Contact Inserted-->"+JSON.stringify(newEmp));
					}
                })      
}) 

//--------------UPDATE------------------------------------------
app.get('/update.html', function (req, res) {
    res.sendFile( __dirname + "/" + "update.html" );
})

app.get("/update", function(req, res) {
	var name=req.query.name;
	var newname=req.query.newname;
	var newnumber=req.query.newnumber;
	var newemail=req.query.newemail;
	var newcity=req.query.newcity;
    db.collection('contacts', function (err, data) {
        data.update({"name":name},{$set:{name:newname,number:newnumber,email:newemail,city:newcity}},{multi:true},
            function(err, obj){
				if (err) {
					console.log("Failed to update data.");
					console.log(err.message);
					res.se
			} else {
				if (obj.result.n==1)
				{
				res.send("<br/>"+newnumber+":"+"<b>Contact Name Updated</b>");
				console.log("contacts Updated")
				}
				else
					res.send("contacts Not Found")
			}
        });
    });
})	




//----------------------SEARCH---------------------------------------

app.get('/search.html', function (req, res) {  
	res.sendFile( __dirname + "/" + "search.html" );    
 })

//--------------SEARCHBYNUMBER------------------------------------------
app.get('/searchbynumber.html', function (req, res) {  
   res.sendFile( __dirname + "/" + "searchbynumber.html" );    
})

app.get("/searchbynumber", function(req, res) {
	//var empidnum=parseInt(req.query.empid)  // if empid is an integer
	var num=req.query.number;
    db.collection('contacts').find({number: num},{name:1,number:1,email:1,city:1,_id:0}).toArray(function(err, docs) {
    if (err) {
      console.log(err.message+ "Failed to get data.");
    } else {
		     res.status(200).json(docs);
	  
    }
  });
  });
  // --------------To find "Single Document"-------------------
	/*var empidnum=parseInt(req.query.empid)
    db.collection('contacts').find({'empid':empidnum}).nextObject(function(err, doc) {
    if (err) {
      console.log(err.message+ "Failed to get data");
    } else {
      res.status(200).json(doc);
    }
  })
}); */

//-------------SEARCHBYNAME-------------------------------------
app.get('/searchbyname.html', function (req, res) {  
	res.sendFile( __dirname + "/" + "searchbyname.html" );    
 })
 
 app.get("/searchbyname", function(req, res) {
	 //var empidnum=parseInt(req.query.empid)  // if empid is an integer
	 var nam=req.query.name;
	 db.collection('contacts').find({name: nam},{name:1,number:1,email:1,city:1,_id:0}).toArray(function(err, docs) {
	 if (err) {
	   console.log(err.message+ "Failed to get data.");
	 } else {
			  res.status(200).json(docs);
	   
	 }
   });
   });
 

//--------------DELETE------------------------------------------
app.get('/delete.html', function (req, res) {  
   res.sendFile( __dirname + "/" + "delete.html" );    
})

app.get("/delete", function(req, res) {
	//var empidnum=parseInt(req.query.empid)  // if empid is an integer
	var nam=req.query.name;
	db.collection('contacts', function (err, data) {
        data.remove({"name":nam},function(err, obj){
				if (err) {
					console.log("Failed to remove data.");
			} else {
				if (obj.result.n>=1)
				{
				res.send("<br/>"+nam+":"+"<b>Contact Deleted</b>");
				
				console.log("contacts Deleted")
				}
				else
					res.send("contacts Not Found")
			}
        });
    });
    
  });
  

//-------------------DISPLAY-----------------------
app.get('/display', function (req, res) { 
//-----IN JSON FORMAT  -------------------------
/*db.collection('contacts').find({}).toArray(function(err, docs) {
    if (err) {
      console.log("Failed to get data.");
    } else 
	{
		res.status(200).json(docs);
    }
  });*/
//------------- USING EMBEDDED JS -----------
 db.collection('contacts').find().sort({number:1}).toArray(
 		function(err , i){
        if (err) return console.log(err)
        res.render('disp.ejs',{contactss: i})  
     })
//---------------------// sort({empid:-1}) for descending order -----------//
}) 

 
var server = app.listen(5000, function () {  
var host = server.address().address  
  var port = server.address().port  
console.log("MEAN Stack app listening at http://%s:%s", host, port)  
})  
}
else
{   db.close();  }
  
});
