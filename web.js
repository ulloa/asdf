var express = require('express');
var mongoose = require('mongoose');
var app = express();


mongoose.connect(process.env.MONGOHQ_URL);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
	console.log('Connected to MongoDB');
});

app.use(express.logger());
app.use("/public", express.static(__dirname + '/public'));
//app.use(express.bodyParser( { keepExtensions: true, uploadDir: __dirname + '/app/uploads' } ));
app.use(express.bodyParser());

var fs = require('fs');
var htmlfile = "index.html";

app.post('/upload-full-form',function(req,res){
    console.log(req.body);
    console.log('FIRST TEST: ' + JSON.stringify(req.files));
    console.log('SECOND TEST: ' + req.files.theFile.name);
    fs.readFile(req.files.theFile.path, function (err, data) {
//s3 keys are heroku environmental variables
//just like mongourl
	var AWS = require('aws-sdk');
	AWS.config.region = 'us-west-2';
	var uuid = require('node-uuid');

	var s3 = new AWS.S3();

	var bucketName = 'adlist';
	var keyName = req.files.theFile.name;

	var bodyStream = fs.createReadStream(req.files.theFile.path);
	var params = {Bucket: bucketName, Key: keyName, Body: bodyStream};
	s3.putObject(params, function(err, data) {
	    if (err)
		console.log(err)
	    else 
	    {
		console.log("Successfully uploaded data to " + bucketName + "/" + keyName);
		var Schema = mongoose.Schema;
		var UserSchema = new Schema({
		    name: String,
		    ads: Array
		});
	    
		var adSchema = new Object({
		    adname: req.body['user.ads.adname'],
		    tags: req.body['user.ads.tags'],
		    imagepath: bucketName + '/' + keyName,
		    gpsloc: {
			lat: req.body['user.ads.gpsloc'],
			lon: Number
		    }
		});

	        var Account = mongoose.model('Accounts', UserSchema);
 	        var newuser = new Account({name: req.body['user.name'], ads: [adSchema]});
                newuser.save(function(err){
		  if(err) console.log(err);
		});
	        res.send(fs.readFileSync('bucket.html').toString());
		s3.getObject(params, function(err, data) {
		    var test = 'Success'
		});
	    }
	});

//        var newPath = __dirname + "/public/" + req.files.theFile.name; //put path here
//        fs.writeFile(newPath, data, function (err) {
//          res.send("hi");  
//        });
    });
});

app.get('/', function(request, response) {
    var html = fs.readFileSync(htmlfile).toString();
    response.send(html);
//  response.send(fs.readFileSync('index.html').tostring());
});


var port = process.env.PORT || 8080;
app.listen(port, function() {
  console.log("Listening on " + port);
});
