var helper = require("./helper.js")
var mysql = require("./mysql.js")
var os = require('os');
var fs = require('fs');
var _ = require("underscore");
var request = require("request");
var querystring = require('querystring');
var Promise = require("bluebird");
var nodemailer = require('nodemailer');

var repo = ""; //"Sample-mock-repo";
var owner = "";//"dupandit";

if (!process.env.BOT_TOKEN) {
    console.log('Error: Specify token in environment');
    process.exit(1);
}

var Botkit = require('botkit');
var controller = Botkit.slackbot({
    debug: false
//include "log: false" to disable logging
});

// connect the bot to a stream of messages
controller.spawn({
    token: process.env.BOT_TOKEN,
  }).startRTM()

  // Intro
controller.hears(['hello','hi','Hello','Hi','Hey'],['mention','direct_mention','direct_message'],function(bot,message)
{   
    bot.api.users.info({user:message.user}, function(err, response) {
        let {name, real_name} = response.user; 
        bot.startConversation(message, function(err, convo) {
            //convo.say("Hello "+name+" "+real_name+"! Please provide repository name to work with?",function(response,convo){
            convo.ask("Hello "+name+" "+real_name+"! Please provide repository name and owner name to work with? (format: <repo> and <owner>)",function(response,convo){
                    
                var arr = [];
                arr = response.text.split(" and ");
                helper.doesRepoAndOwnerExist(arr[0],arr[1]).then(function (statusReport)
                {
                    console.log("statusReport is: " + statusReport);
                    //if(statusReport === 1 || statusReport == '1'){
                        repo = arr[0];
                        owner = arr[1];
                        console.log("repo: " + arr[0]);
                        console.log("owner: " + arr[1]); 
                        
                        //convo.reply(message,"The repo is: " + repo1);
                        bot.reply(message, "The repo is: " + repo + " and the owner is :" + owner + "is set, please enter a use case");
                        convo.stop();        
                    // } else{
                    //     bot.reply(message, "The repo name and owner combination is incorrect");
                    //     convo.stop();
                    // }  
                }).catch(function(err){
                    console.log("the function reaches here");
                    bot.reply(message, err);
                });;
                // repo = arr[0];
                // owner = arr[1];
                // console.log("repo: " + arr[0]);
                // console.log("owner: " + arr[1]); 
                
                // //convo.reply(message,"The repo is: " + repo1);
                // bot.reply(message, "The repo is: " + repo + " and the owner is :" + owner);
                // convo.stop();            
            });
            //convo.ask("Whom do you want to assign this issue?", function(response, convo) {
            //mysql.updateUserTags(null);
            //mysql.insertIssueTags(null);
            //mysql.insertUserTags(null);
            //convo.stop();
            
        });
    });
});

/**
 * Use Case 1
 * @desc Finding assignee for given issue
 * @param issueNumber issue for which assinee suggestion is required
 */
controller.hears('find issue (.*)',['mention', 'direct_mention','direct_message'], function(bot,message) 
{   
    var issueNumber = message.match[1];
    controller.storage.users.get(message.user, function(err, user) {
        bot.startConversation(message, function(err, convo) {
            helper.getPossibleAssignees(issueNumber).then(function(assigneeList){
                var userList = [];
                console.log("Assignee: "+assigneeList);
                assigneeList.forEach(function(user) {
                    userList.push(user);
                    console.log("Emp Id: " + user);
                    convo.say("Emp Id: " + user);// + " Skills: " + element.skills);
                }, this);
                convo.ask("Whom do you want to assign this issue?", function(response, convo) {
                    helper.isValidUser(response.text, userList).then(function (userId){
                        convo.ask('Do you want to assign issue to ' + userId + '? Please confirm', [
                        {
                            pattern: 'yes',
                            callback: function(response, convo) {
                                //convo.say("Issue assigned to " + userId);
                                helper.assignIssueToEmp(userId, owner, repo, issueNumber).then(function(response){
                                    console.log("issue assign true");
                                    bot.reply(message, response);
                                }).catch(function(err){
                                    bot.reply(message, error);
                                });
                                convo.next();
                            }
                        },
                        {
                            pattern: 'no',
                            callback: function(response, convo) {
                                bot.reply(message,"Ok! Ping me if you need anything!");
                                convo.stop();
                            }
                        },
                        {
                            default: true,
                            callback: function(response, convo) {
                                convo.repeat();
                                convo.next();
                            }
                        }]);
                        convo.next();
                    }).catch(function (err){
                        bot.reply(message, err);
                    }); 
                });
            }).catch(function(err){
                bot.reply(message, err);
            });
        });
    });
});

// USE CASE 2
controller.hears('find contributors for file (.*)',['mention', 'direct_mention','direct_message'], function(bot,message) 
{   
    //console.log("The call is entering the contributors function");
    var fileName = message.match[1];    
    bot.startConversation(message, function(err,convo){
    var userList = [];    
    helper.listOfCommits(owner,repo,fileName).then(function (commits_of_a_file)
        {
            //console.log(commits_of_a_file.length + "fdsfdsf");
            if(commits_of_a_file.length == 0){
                bot.reply(message, "Enter a valid file name with extention. It is case sensitive");
                convo.stop();

            }else {
                //console.log("Taking the inputs of file")
                var comm = _.pluck(commits_of_a_file,"commit");
                //console.log("comm: " + comm);
                //console.log("hi");
            
            //convo.say("The major contributors are: ");
                var dict = {}; // creating a dict to store the key value pairs with aggregation
                var result = '';
                comm.forEach(function(e){
                    userList.push(e.author.name);
                    result += "\nUser: "+e.author.name + "\nDate: " + e.committer.date + "\nMessage: "+e.message +"\n";
                    //console.log("User: "+e.author.name+"\nDate: "+e.committer.date+"\nMessage: "+e.msg);
                    });
                
                    comm.forEach(function(e){
                    if(dict.hasOwnProperty(e.author.name)){
                        dict[e.author.name] = dict[e.author.name] + 1;
                    } else{
                        dict[e.author.name] = 1;
                    }

                    console.log ("making a dictionary:");
                    console.log(dict);             
                });
                result += "\nSummary\n";
                var res = []; // creating a temporary storage to summarize the total commits. 
                for(var prop in dict){
                    res.push({user: prop, TotalCommits: dict[prop]});
                    //console.log("user: " + prop);
                    result += "User: " + prop + " has: " + dict[prop] + " commits in all \n";
                    //bot.reply(message, "User: " + prop + " has: " + dict[prop] + " commits in all");
                }

            bot.reply(message, "The major contributors are: "  + result);
            //bot.reply(message, "We are outside the print on commits");
                
            convo.ask("\nWhom do you want to send notif to ?", function(response, convo) {
                console.log("Code entered this notif section");
                helper.isValidUser(response.text, userList).then(function (userId){
                    convo.ask('Do you want to send to ' + userId + '? Please confirm', [
                    {
                        pattern: 'yes',
                        callback: function(response, convo) {
                            //convo.say("Issue assigned to " + userId);
                            var count = 0;
                            comm.forEach(function(e){
                                if(e.author.name === userId && count ===0){
                                count = 1;
                                console.log ("finding email id");
                                var subjectToSend = 'Error in one of your previous work files';
                                var textToSend = 'Hi ' + e.author.name + ', This is TraziBot. You will be contacted for a file query soon.'
                                var sendTo= e.author.email;
                                emailing(sendTo, subjectToSend, textToSend);
                                bot.reply(message,"The email is sent to " + e.author.email);
                                }
                            }, this);
                            count =0;
                            
                            convo.next();
                        }
                    },
                    {
                        pattern: 'no',
                        callback: function(response, convo) {
                            bot.reply(message,"Ok! Ping me if you need anything!");
                            convo.stop();
                        }
                    },
                    {
                        default: true,
                        callback: function(response, convo) {
                            convo.repeat();
                            convo.next();
                        }
                    }]);
                    convo.next();
                }).catch(function (e){
                    bot.reply(message, "User not from given recommendations, enter valid user id.");
                }); 
            });
        
            }  // for the new else part of blank data
        });
        //bot.reply(message, "this is an extra message2");
        //convo.stop();
    });
});


function emailing(sendTo, subjectToSend, textToSend){
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.USER_TOKEN, //'email.com',
            pass: process.env.PASS_TOKEN //'pass'
        }
    });
    transporter.sendMail({
        from: process.env.USER_TOKEN, //'email.com',
        to:   sendTo,  //req.body.email,
        subject:  subjectToSend,//'Error in your previous work file',
        text: textToSend //'Hi ' + e.author.name + ', This is your Bot. You will be contact for the the file soon.'
    });
}

// USE CASE 3
controller.hears('find reviewers for issue (.*)',['mention', 'direct_mention','direct_message'], function(bot,message) 
{
    var issueNumber = message.match[1];
    controller.storage.users.get(message.user, function(err, user) {
        bot.startConversation(message, function(err, convo) {

            var reviewers = helper.getPossibleReviewers(issueNumber);
            var userList = [];
            reviewers.forEach(function(element) {
                userList.push(element.id);
                convo.say("Emp Id: " + element.id + " Skills: " + element.skills);
                //console.log(element.skills+ " "+element.id);
            }, this)
            convo.ask("Whom do you want to select as a reviewer? Provide comma separated ids", function(response, convo) {
                helper.isValidReviwer(response.text, userList).then(function (userId){
                    console.log("assigning issue");
                    convo.ask('Do you want to assign ' + userId + ' as a reviewer for issue #?' + issueNumber + ' Please confirm', [
                    {
                        pattern: 'yes',
                            callback: function(response, convo) {
                                //convo.say("Issue assigned to " + userId);
                                helper.assignReviewerForIssue(userId, issueNumber).then(function(response){
                                    console.log("issue reviewer true");
                                    bot.reply(message, response);
                                }).catch(function(err){
                                    bot.reply(message, error);
                                });
                                convo.next();
                            }
                        },
                        {
                            pattern: 'no',
                            callback: function(response, convo) {
                                bot.reply(message,"Ok! Ping me if you need anything!");
                                convo.stop();
                            }
                        },
                        {
                            default: true,
                            callback: function(response, convo) {
                                convo.repeat();
                                convo.next();
                            }
                        }]);
                        convo.next();
                    }).catch(function (e){
                        bot.reply(message, "User "+e+" not from given recommendations, enter valid id.");
                    });
                        
                });
        });
    });
});

controller.hears(['.*'],['mention', 'direct_mention','direct_message'], function(bot,message) 
{
    console.log(message);

    bot.reply(message, "Wrong command! Valid commands are as follows:\n"+
    "find assignees for issue [issue number]\n"+
    "find contributors for file [file name]\n"+
    "find reviewers for issue [issue number]");

    // bot.startConversation(message, function(err, convo) {
    //     convo.say("Wrong command! Valid commands are as follows:\n"+
    //                 "find assignees for issue [issue number]\n"+
    //                 "find contributors for file [file name]\n"+
    //                 "find reviewers for issue [issue number]");
    // });
});
