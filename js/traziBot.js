var helper = require("./helper.js")
var mysql = require("./mysql.js")
var os = require('os');
var fs = require('fs');
var _ = require("underscore");
var request = require("request");
var querystring = require('querystring');
var Promise = require("bluebird");
var nodemailer = require('nodemailer');

var repo = "Sample-mock-repo";
var owner = "dupandit";

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
            bot.reply(message,"Hello "+name+" "+real_name+"! Please provide repository name to work with");
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
                var result = Object.keys(assigneeList).sort(function(a, b) {
                    return assigneeList[b] - assigneeList[a];
                });
                  
                // Object.keys(assigneeList).forEach(function(key) {
                //     userList.push(key);
                //     console.log("Emp Id: " + key);
                //     console.log(key, assigneeList[key]);
                //     convo.say("Emp Id: " + key);
                // }, this);
                // result.forEach(function(user) {
                //     userList.push(user);
                //     console.log("Emp Id: " + user);
                //     convo.say("Emp Id: " + user);// + " Skills: " + element.skills);
                // }, this );
                for(var i=0; i<result.length && i<3;i++){
                    userList.push(result[i]);
                    console.log("Emp Id: " + result[i]);
                    convo.say("Emp Id: " + result[i]);// + " Skills: " + element.skills);
                }
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
                bot.reply(message, "Enter a valid file name with extenxtion. It is case sensitive");
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
                                //console.log(dict);
                                
                                            var transporter = nodemailer.createTransport({
                                                service: 'gmail',
                                                auth: {
                                                    user: process.env.USER_TOKEN, //'email.com',
                                                    pass: process.env.PASS_TOKEN //'pass'
                                                }
                                            });
                                            transporter.sendMail({
                                                from: process.env.USER_TOKEN, //'email.com',
                                                to:   e.author.email,  //req.body.email,
                                                subject: 'Error in your previous work file',
                                                text: 'Hi ' + e.author.name + ', This is your Bot. You will be contact for the the file soon.'
                                            });
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

// USE CASE 3
controller.hears('find reviewers for issue (.*)',['mention', 'direct_mention','direct_message'], function(bot,message) 
{
    var issueNumber = message.match[1];
    controller.storage.users.get(message.user, function(err, user) {
        bot.startConversation(message, function(err, convo) {

            var reviewers = helper.getPossibleReviewers(issueNumber);
            helper.getPossibleReviewers(issueNumber).then(function(reviewers){
                
                var userList = [];
                reviewers.forEach(function(element) {
                    userList.push(element);
                    convo.say("Emp Id: " + element);
                    //console.log(element.skills+ " "+element.id);
                }, this)
                convo.ask("Whom do you want to select as a reviewer? Provide comma separated ids", function(response, convo) {
                    helper.isValidReviwer(response.text, userList).then(function (users){
                        console.log("assigning issue");
                        convo.ask('Do you want to assign ' + users + ' as a reviewer for issue #?' + issueNumber + ' Please confirm', [
                        {
                            pattern: 'yes',
                                callback: function(response, convo) {
                                    //convo.say("Issue assigned to " + userId);
                                    helper.assignReviewerForIssue(users, issueNumber).then(function(response){
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
