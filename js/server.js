var ngrok = require('ngrok');
var request = require('request');
var express = require('express');
var _ = require('underscore');
var fs = require('fs');
var app = express();

ngrok.connect(8080, function (err, url) {
    console.log(url);


    // var svr = http.createServer(function(req, resp) {
    //     var body = "";
    // req.on('data', function (chunk) {
    //     body += chunk;
    // });
    // req.on('end', function () {
    //     console.log('body: ' + body);
    //     var jsonObj = JSON.parse(body);
    // console.log(jsonObj.$key);
    // })
    //     resp.end('Hello, World!');
    // });

});

app.post('/payload', function(req, res){
    var body = "";
    req.on('data', function (chunk){
        body += chunk;
    });
    req.on('end', function(){
        // console.log('body: ' + body);
        var jsonObj = JSON.parse(body);  
        console.log(jsonObj);
    })
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.end('thanks');
});

port = 8080;
app.listen(port);
console.log('Listening at : ' + port)

