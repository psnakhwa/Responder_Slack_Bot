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

var dict = {};
var arr = [];

//getIssueDetails(userId,repoName,2)


function getIssueDetails(owner,repo,number){

       var options = {
           url: urlRoot + "/repos/" + owner + "/" + repo + "/issues/"+number,
           method: 'GET',
           headers: {
                        "User-Agent": "EnableIssues",
                        "content-type": "application/json",
                        "Authorization": token
                    }
           };

       return new Promise(function (resolve, reject)
       {
               // Send a http request to url and specify a callback that will be called upon its return.
               request(options, function (error, response, body) {
                   var obj = JSON.parse(body);
                   var string_obj = JSON.stringify(obj);
                   //console.log(string_obj);
                   var labels = obj.labels


                   // Task 1 : Extract labels and get the skillset
                  for(var i=0; i<labels.length; i++)
                  {
                      arr.push(labels[i].name)
                  }
                  //console.log(arr1)


                  // Task 2 : Create dictionary of userid : skills
                  var assignees = obj.assignees;
                  for(var i = 0; i<assignees.length; i++)
                  {
                      dict[assignees[i].login]=arr;
                  }
                  //console.log(arr);
                  console.log(dict);




                   return dict;
               });
       });
   }

exports.getIssueDetails = getIssueDetails;
