var helper = require("./helper.js")
var mysql = require("./mysql.js")
var os = require('os');
var fs = require('fs');
var _ = require("underscore");
var request = require("request");
var querystring = require('querystring');
var Promise = require("bluebird");
var nodemailer = require('nodemailer');
var Botkit = require('botkit');

var repo = "";  //"Sample-mock-repo";
var owner = ""; //"dupandit";

var exbot;
var checkRepo = '';
var checkOwner = '';

if (!process.env.BOT_TOKEN) {
    console.log('Error: Specify token in environment');
    process.exit(1);
}

var controller = Botkit.slackbot({
    debug: false
//include "log: false" to disable logging
});

// connect the bot to a stream of messages
controller.spawn({
    token: process.env.BOT_TOKEN,
}).startRTM()

// Start Conversation
controller.hears(['hello','hi','Hello','Hi','Hey'],['mention','direct_mention','direct_message'],function(bot,message) {
    console.log(" bot here is " + bot);  
    
    bot.api.users.info({user:message.user}, function(err, response) {
      let {name, real_name} = response.user;
      console.log("user: " + response.user);
      bot.startConversation(message, function(response, convo){
            convo.ask("Hi " + real_name + " Please enter the repository name to work with?", function(response, convo) {
            convo.say("Awesome.");
            checkRepo = response.text;
            console.log("bot in ask: ", bot);
            helper.askOwner(response, convo, checkRepo, bot, message);
            convo.next();
          });
      });
      });
});

// USE CASE 1
controller.hears('find issue (.*)',['mention', 'direct_mention','direct_message'], function(bot,message) 
{   
    var issueNumber = message.match[1];
    controller.storage.users.get(message.user, function(err, user) {
        bot.startConversation(message, function(err, convo) {
            helper.getPossibleAssignees(issueNumber,repo,owner).then(function(assigneeList){
                var userList = [];
                console.log("Assignee: "+assigneeList);
                var result = Object.keys(assigneeList).sort(function(a, b) {
                    return assigneeList[b] - assigneeList[a];
                });
                for(var i=0; i<result.length && i<3;i++){
                    userList.push(result[i]);
                    console.log("Emp Id: " + result[i]);
                    convo.say("Emp Id: " + result[i]);
                }
                convo.ask("Whom do you want to assign this issue?", function(response, convo) {
                    helper.isValidUser(response.text, userList).then(function (userId){
                        convo.ask('Do you want to assign issue to ' + userId + '? Please confirm', [
                        {
                            pattern: 'yes',
                            callback: function(response, convo) {
                                helper.assignIssueToEmp(userId, repo, owner, issueNumber).then(function(response){
                                    console.log("issue assign true");
                                    bot.reply(message, response);
                                    var subjectToSend = 'Notification from TraziBot';
                                    var textToSend = 'Hi, This is TraziBot. Issue ' + issueNumber + ' in repo ' + repo + ' is assigned to you';
                                    mysql.getEmail([userId]).then(function(emailId){
                                        console.log("Email is: "+emailId[0])
                                        helper.emailing(emailId[0], subjectToSend, textToSend);
                                    });
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
                var comm = _.pluck(commits_of_a_file,"commit");
                var dict = {}; // creating a dict to store the key value pairs with aggregation
                var result = '';
                comm.forEach(function(e){
                    userList.push(e.author.name);
                    result += "\nUser: "+e.author.name + "\nDate: " + e.committer.date + "\nMessage: "+e.message +"\n";
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
                    result += "User: " + prop + " has: " + dict[prop] + " commits in all \n";
                }

            bot.reply(message, "The major contributors are: "  + result);
                
            convo.ask("\nWhom do you want to send notif to ?", function(response, convo) {
                console.log("Code entered this notif section");
                helper.isValidUser(response.text, userList).then(function (userId){
                    convo.ask('Do you want to send to ' + userId + '? Please confirm', [
                    {
                        pattern: 'yes',
                        callback: function(response, convo) {
                            var count = 0;
                            comm.forEach(function(e){
                                if(e.author.name === userId && count ===0){
                                count = 1;
                                console.log ("finding email id");
                                var subjectToSend = 'Error in one of your previous work files';
                                var textToSend = 'Hi ' + e.author.name + ', This is TraziBot. You will be contacted for a file query soon.'
                                var sendTo= e.author.email;
                                helper.emailing(sendTo, subjectToSend, textToSend);
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
    });
});

// USE CASE 3
controller.hears('find reviewers for issue (.*)',['mention', 'direct_mention','direct_message'], function(bot,message) 
{
    var issueNumber = message.match[1];
    controller.storage.users.get(message.user, function(err, user) {
        bot.startConversation(message, function(err, convo) {
            helper.getPossibleReviewers1(issueNumber,repo,owner).then(function(reviewertable){
                helper.getPossibleReviewers2(issueNumber,repo,owner).then(function(assigneetable){
                    var userList = [];
                    var result_assignee_table = Object.keys(assigneetable).sort(function(a, b) {
                        return assigneetable[b] - assigneetable[a];
                    });
                    var result_review_table = Object.keys(reviewertable).sort(function(a, b) {
                        return reviewertable[b] - reviewertable[a];
                    });
                    result_assignee_table = result_assignee_table.filter(function (item) {
                    return result_review_table.indexOf(item) === -1;
                    });
                    convo.say("Users who have experience in reviewing similar types of issue");
                    for(var i=0; i<result_review_table.length && i<3;i++){
                        userList.push(result_review_table[i]);
                        convo.say("Emp Id: " + result_review_table[i]);
                    }
                    if(result_assignee_table.length!=0){
                        convo.say("These users have not reviewed similar type of issues but have some experience in working with similar issues");
                        for(var i=0; i<result_assignee_table.length && i<3;i++){
                            userList.push(result_assignee_table[i]);
                            convo.say("Emp Id: " + result_assignee_table[i]);
                        }
                    }
                    convo.ask("Whom do you want to select as a reviewer? Provide comma separated ids", function(response, convo) {
                        helper.isValidReviwer(response.text, userList).then(function (users){
                            console.log("assigning issue");
                            convo.ask('Do you want to assign ' + users + ' as a reviewer for issue #?' + issueNumber + ' Please confirm', [
                            {
                                pattern: 'yes',
                                    callback: function(response, convo) {
                                        helper.assignReviewerForIssue(users, issueNumber).then(function(response){
                                            console.log("issue reviewer true");
                                            var subjectToSend = 'Notification from TraziBot';
                                            var textToSend = 'Hi, This is TraziBot. You have been assigned as a reviewer for issue '+issueNumber+' in repo ' +repo;
                                            mysql.getEmail(userList).then(function(emailId){
                                                for(var i=0;i<emailId.length;i++){
                                                    helper.emailing(emailId[i], subjectToSend, textToSend);
                                                }
                                            });
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
});

// Invalid User Input
controller.hears(['.*'],['mention', 'direct_mention','direct_message'], function(bot,message) 
{
    console.log(message);

    bot.reply(message, "Wrong command! Valid commands are as follows:\n"+
    "find assignees for issue [issue number]\n"+
    "find contributors for file [file name]\n"+
    "find reviewers for issue [issue number]");
});
