// for finding list of people who can work on current repo
var token = "token " + process.env.GITHUB_TOKEN;
var urlRoot = "https://github.ncsu.edu/api/v3";
var data = require('./mock.json');
var nock = require("nock");
var _ = require("underscore");
var request = require("request");
var querystring = require('querystring');
var Promise = require("bluebird");

//console.log(data);
var mockIssueList = nock("https://github.ncsu.edu/api/v3")
.persist() // This will persist mock interception for lifetime of program.
.get("/repos/dupandit/Sample-mock-repo/issues")
.reply(200, JSON.stringify(data.issueList) );

var mockCollaborators = nock("https://github.ncsu.edu/api/v3")
.persist() // This will persist mock interception for lifetime of program.
.get("/repos/dupandit/Sample-mock-repo/collaborators")
.reply(200, JSON.stringify(data.collaborators) );

var mockCommits = nock("https://github.ncsu.edu/api/v3")
.persist() // This will persist mock interception for lifetime of program.
.get("/repos/dupandit/Sample-mock-repo/commits")
.reply(200, JSON.stringify(data.commits_of_a_file) );

var mockReviewers = nock("https://github.ncsu.edu/api/v3")
.persist() // This will persist mock interception for lifetime of program.
.get("/repos/dupandit/Sample-mock-repo/reviewers")
.reply(200, JSON.stringify(data.reviewers) );

var issuedetails = nock("https://github.ncsu.edu/api/v3")
.persist() // This will persist mock interception for lifetime of program.
.get("/repos/dupandit/Sample-mock-repo/issues/1")
.reply(200, JSON.stringify(data.issueList[0]) );


// Usecase 1 : 

/**
 * @desc
 * @param
 * @return
 */
function assignReviewerForIssue(userId, issueNumber){
    console.log("assignReviewerForIssue start");
    return new Promise(function(resolve, reject){
        resolve("Reviewer " + userId + " assigned to issue #" + issueNumber);
    });
    console.log("assignReviewerForIssue end");
}

function getPossibleAssignees(issueNumber){
    var assignees = data.users;
    return assignees;
}


/**
 * @desc this will assign userId to issueNumber
 * @param userId emp to whom we will assign an issue
 * @param issueNumber issue to assigned
 * @return
 */
function assignIssueToEmp(userId, issueNumber){


    return new Promise(function(resolve, reject){
        resolve("Issue " + issueNumber + " assigned to " + userId);
    });
    console.log("assignIssueToEmp end");
}



// Usecase 2 :
function Listofcommits(owner,repo) {
  var options = {
      url: urlRoot + "/repos/" + owner + "/" + repo + "/commits",
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
               resolve(obj);
           });
      });
}


// Usecase 3 :

function Listofissues(owner,repo) {
  var options = {
      url: urlRoot + "/repos/" + owner + "/" + repo + "/issues",
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
               resolve(obj);
           });
      });
}


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
                resolve(obj);
            });
    });
}


// Miscellaneous functions

/**
 * @desc
 * @param
 * @return
 */
function getCollaborators(owner,repo){

    var options = {
        url: urlRoot + "/repos/" + owner + "/" + repo + "/collaborators",
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
                 resolve(obj);
             });
        });
}



function isValidUser(userId, userList){

    return new Promise(function (resolve, reject)
	{
         if(userList.indexOf(userId)>-1){
            resolve(userId);
        }
        reject(userId);
    });
}



exports.getIssueDetails = getIssueDetails
exports.Listofcommits = Listofcommits
exports.getCollaborators = getCollaborators;
exports.Listofissues = Listofissues;
exports.assignIssueToEmp = assignIssueToEmp;
exports.isValidUser = isValidUser;
exports.getPossibleAssignees = getPossibleAssignees;
exports.assignReviewerForIssue = assignReviewerForIssue;
