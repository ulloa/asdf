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


var fs = require('fs');
var htmlfile = "index.html";

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
