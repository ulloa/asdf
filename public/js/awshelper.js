var fs = require('fs');
var AWS = require('aws-sdk');
AWS.config.region = 'us-west-2';
var uuid = require('node-uuid');

// Create an S3 client                                                          
var s3 = new AWS.S3();

// Create a bucket and upload something into it                                 
var bucketName = 'adlist';
var keyName = 'user/'+ user.adname + '.jpg';

var bodyStream = fs.createReadStream(image_path);
var params = {Bucket: bucketName, Key: keyName, Body: bodyStream};
s3.putObject(params, function(err, data) {
    if (err)
        console.log(err)
    else
        console.log("Successfully uploaded data to " + bucketName + "/" + keyName);
});

