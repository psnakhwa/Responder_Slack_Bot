//var data = require('../mock_data/mock.json'); 
var mysql = require("./mysql.js")
var nock = require("nock");
var request = require("request");
var Promise = require("bluebird"); 
var spawn = require("child_process").spawn;
var token = "token " + process.env.GITHUB_TOKEN;
var urlRoot = "https://github.ncsu.edu/api/v3";

/**
 * @desc this will assign userId to issueNumber
 * @param userId emp to whom we will assign an issue
 * @param issueNumber issue to assigned
 * @return 
 */
 // Use Case 1
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
                    if(!error){
                        var obj = JSON.parse(body);
                        console.log("Got issue details from API: " + obj.number);
                        if(obj.number == undefined){
                            console.log("in issue not found");
                            reject("Issue does not found.")
                        }
                        else if(obj.state == 'closed'){
                            console.log("in closed");
                            reject("Issue is already closed.")
                        }
                        else{
                            resolve(obj);    
                        }
                    }
                    else{
                        console.log("issue not found");
                    }
                });
        });
    }

function getIssueTags(issueName){
    return new Promise(function (resolve, reject)
    {
        //console.log('get tags start');
        var process = spawn('python',["../python/find_tags/issue_tags.py", issueName]);
        var tags;
        process.stdout.on('data', function (data){
            console.log(data);
            data = data.toString().replace(/[']+/g,'"');
            tags = JSON.parse(data);
        });
        process.stdout.on('end', function (){
            console.log('Got the tags: '+tags);
            resolve(tags);
        });
    });
}
    
function getPossibleAssignees(issueNumber){
    return new Promise(function(resolve, reject){
        getIssueDetails('dupandit','Sample-mock-repo',issueNumber).then(function(response){
            //console.log("IssueDetails: ",response); 
            getIssueTags(response.title + " " + response.body).then(function(issueTagsList){
                console.log("tags: "+issueTagsList);   
                getCollaborators('dupandit','Sample-mock-repo').then(function(collabs){ 
                    var userList=[];
                    for(var i=0;i<collabs.length;i++){
                        userList.push(collabs[i].login);
                    }
                    mysql.getUserTagsCount(userList, issueTagsList,"").then(function(assigneeList){
                        resolve(assigneeList);
                    }).catch(function(err){
                        reject(error);
                    });
                });
            }).catch(function(err){
                console.log("didnt get tags");
            });
        }).catch(function(err){
            reject(err);
        });   
    });
}

function assignIssueToEmp(userId, owner, repo, issueNumber){
    var options = {
            url: urlRoot + "/repos/" + owner + "/" + repo + "/issues/"+issueNumber,
            method: 'PATCH',
            headers: {
                         "User-Agent": "EnableIssues",
                         "content-type": "application/json",
                         "Authorization": token
                     },
            json:  {
                        "assignees" : [
                                        userId
                                    ]
                   }
            };
    
        return new Promise(function (resolve, reject)
        {
            request(options, function (error, response, body) {
                resolve("Issue " + issueNumber + " assigned to user " + userId);
            });
        });
       
}

// Usecase 2 :
function listOfCommits(owner,repo,fileName) {
    //console.log("The call is coming to helper.js: " + fileName);
    var options = {
        url: urlRoot + "/repos/" + owner + "/" + repo + "/commits" + "?path=" + fileName,
        method: 'GET',
        headers: {
                     "User-Agent": "EnableIssues",
                     "content-type": "application/json",
                     "Authorization": token
                 }
        };
        //console.log("the url gen is :" + options.url);
        return new Promise(function (resolve, reject)
        {
             // Send a http request to url and specify a callback that will be called upon its return.
             request(options, function (error, response, body) {
                //console.log("body of msg is: "+ body); 
                var obj = JSON.parse(body);
                 //console.log("This is the pulled object" +obj);
                 resolve(obj);
             });
        });
}

// Usecase 3:
function getPossibleReviewers1(issueNumber){
    return new Promise(function(resolve, reject){
        getIssueDetails('dupandit','Sample-mock-repo',issueNumber).then(function(response){ 
            var assignee = response.assignees[0].login;
            getIssueTags(response.title + " " + response.body).then(function(issueTagsList){
                console.log("tags: "+issueTagsList);
                getCollaborators('dupandit','Sample-mock-repo').then(function(collabs){
                    var userList=[];
                    for(var i=0;i<collabs.length;i++){
                        userList.push(collabs[i].login);
                    }
                    console.log('All users are: '+userList);
                    mysql.getReviewerTagsCount(userList, issueTagsList,assignee).then(function(ReviewertableList){
                        console.log("Revs from rev table are: "+ReviewertableList);
                        resolve(ReviewertableList);
                    }).catch(function(err){
                    reject(error);
                    });
                }).catch(function(err){
                    console.log("Error in finding collaborators")
                });
            }).catch(function(err){
                console.log("didnt get tags");
            });
        });   
    });
}

function getPossibleReviewers2(issueNumber){
    return new Promise(function(resolve, reject){
        getIssueDetails('dupandit','Sample-mock-repo',issueNumber).then(function(response){
            var assignee = response.assignees[0].login;
            getIssueTags(response.title + " " + response.body).then(function(issueTagsList){
                console.log("tags: "+issueTagsList);
                getCollaborators('dupandit','Sample-mock-repo').then(function(collabs){
                    var userList=[];
                    for(var i=0;i<collabs.length;i++){
                        userList.push(collabs[i].login);
                    }
                    console.log('All users are: '+userList);
                    mysql.getUserTagsCount(userList, issueTagsList,assignee).then(function(AssigneetableList){
                        console.log("Revs from assig table are: "+AssigneetableList);
                        resolve(AssigneetableList);
                    }).catch(function(err){
                    reject(error);
                    });
                }).catch(function(err){
                    console.log("Error in finding collaborators")
                });
            }).catch(function(err){
                console.log("didnt get tags");
            });
        });   
    });
}

function assignReviewerForIssue(users, issueNumber){
    return new Promise(function(resolve, reject){
        mysql.insertIssueReviewers(users,issueNumber).then(function(response){
            console.log(response);
            resolve("Reviewer " + users + " assigned to issue #" + issueNumber);
        });
    });
}


// Utilities
function doesRepoAndOwnerExist(repo, owner){
    var options = {
        url: urlRoot + "/repos/" + owner + "/" + repo,
        method: 'GET',
        headers: {
                     "User-Agent": "EnableIssues",
                     "content-type": "application/json",
                     "Authorization": token
                 }
    };
        //console.log("the url gen is :" + options.url);
        return new Promise(function (resolve, reject)
        {
             // Send a http request to url and specify a callback that will be called upon its return.
             request(options, function (error, response, body) {
                console.log("Error status for the repos code: ");
                console.log(response.statusCode);
                if (response && (response.statusCode === 200 || response.statusCode === 201)) {
                    var obj = JSON.parse(body);
                    resolve(1);
                    console.log("Passing resolve value as: " + obj);
                    //resolve(body);
                }
                else {
                    console.log("obj: "+ obj);
                    reject("repo doesnt exist");
                }
            });
        });
}


function isValidUser(userId, userList){
    return new Promise(function (resolve, reject)
    {
         if(userList.indexOf(userId)>-1){
            resolve(userId);
        }
        reject(userId+" not from given recommendations, enter valid id.");
    });
}

function isValidReviwer(userId, userList){
    return new Promise(function (resolve, reject)
    {
        var users = userId.split(",");
        users.forEach(function(user) {
            if(userList.indexOf(user.trim())<0){
                reject(user);
            } 
        });
        resolve(users);
    });
}

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

exports.getCollaborators = getCollaborators;
exports.assignIssueToEmp = assignIssueToEmp;
exports.isValidUser = isValidUser;
exports.getPossibleAssignees = getPossibleAssignees;
exports.assignReviewerForIssue = assignReviewerForIssue;
exports.listOfCommits = listOfCommits
exports.getPossibleReviewers1 = getPossibleReviewers1;
exports.getPossibleReviewers2 = getPossibleReviewers2;
exports.isValidReviwer = isValidReviwer;
exports.getIssueDetails = getIssueDetails;
exports.getIssueTags = getIssueTags;
exports.doesRepoAndOwnerExist = doesRepoAndOwnerExist;