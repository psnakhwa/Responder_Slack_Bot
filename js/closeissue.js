//Initialization
var request = require('request');
var fs = require("fs");
var Promise = require('bluebird');
var parse = require('parse-link-header');
var urlRoot = "https://github.ncsu.edu/api/v3";
var express = require('express');






// Enter the value of variables below where <> is marked
var userId = "dupandit";
var repoName = "Sample-mock-repo"   //Your already created Repo name
// //var repo = "<enter a repo that you want to create>" //name of the repo that you want to createElement
// var issue_number = "2"
var token = "token " + "9a4e59bc779a095357f239af7e84e45b6d830703";


//ClosetheIssue(userId,repoName,issue_number)

function ClosetheIssue(owner,repo,issueno)
{
	//console.log('Editing your repo, please wait\n\n')
	console.log('Owner :'+userId+'\n')
	var options = {
		url: urlRoot + '/repos/'+owner+'/'+repo+"/issues/"+issueno,
		method: 'PATCH',

		headers: {
			"User-Agent": "EnableIssues",
			"content-type": "application/json",
			"Authorization": token
		},

		json : {
			  "state": "closed",

		}

	};


	return new Promise(function (resolve, reject)
	{
					// Send a http request to url and specify a callback that will be called upon its return.
					request(options, function (error, response, body) {
							resolve(body);
					});
	});
}

exports.ClosetheIssue = ClosetheIssue;
