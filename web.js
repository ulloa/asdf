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


var fs = require('fs');
var htmlfile = "index.html";

app.post('/upload-full-form',function(req,res){
    console.log('FIRST TEST: ' + JSON.stringify(req.files));
    console.log('SECOND TEST: ' + req.files.theFile.name);
    fs.readFile(req.files.theFile.path, function (err, data) {
        var newPath = __dirname + "/app/uploads/" + req.files.theFile.name;
        fs.writeFile(newPath, data, function (err) {
          res.send("hi");  
        });
    });
});

app.get('/', function(request, response) {
    var html = fs.readFileSync(htmlfile).toString();
    response.send(html);
//  response.send(fs.readFileSync('index.html').tostring());
});

var AnimalSchema = new Object({
	name: String,
	type: String
});

var Animal = mongoose.model('Animal', AnimalSchema);
var cat = new Animal({name:'Pumpkin', type:'cat'});
cat.save()


var port = process.env.PORT || 8080;
app.listen(port, function() {
  console.log("Listening on " + port);
});
