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
        var jsonObj = JSON.parse(body);  
	dict = {};
        arr_assignees = [];
	arr_labels = [];
	obj_labels = jsonObj.issue.labels;

	if(jsonObj.action == "closed")
	{
		dict["title"]=jsonObj.issue.title;
		dict["desc"]=jsonObj.issue.body;
                for(var i=0; i<obj_labels.length; i++)
                {
                    arr_labels.push(obj_labels[i].name);
                }
		dict["labels"]=arr_labels;

		for(var i=0; i<jsonObj.issue.assignees.length;i++)
		{
			arr_assignees.push(jsonObj.issue.assignees[i].login);
		}
		dict["assignees"]=arr_assignees;
	}
	console.log(dict);





    })
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.end('thanks');
});

port = 8080;
app.listen(port);
console.log('Listening at : ' + port)

