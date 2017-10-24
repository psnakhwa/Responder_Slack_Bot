var helper = require("./helper.js")
var os = require('os');
var fs = require('fs');

if (!process.env.BOT_TOKEN) {
    console.log('Error: Specify token in environment');
    process.exit(1);
}

var Botkit = require('botkit');
var controller = Botkit.slackbot({
    debug: false
//include "log: false" to disable logging
//or a "logLevel" integer from 0 to 7 to adjust logging verbosity
});

// connect the bot to a stream of messages
controller.spawn({
    token: process.env.BOT_TOKEN,
  }).startRTM()

// controller.hears('weather',['mention', 'direct_mention','direct_message'], function(bot,message) 
// {
//     console.log(message);
//     bot.reply(message,"The weather is great");
// });

/**
 * Use Case 1
 * @desc Finding assignee for given issue
 * @param issueNumber issue for which assinee suggestion is required
 */
controller.hears('assignee issue (.*)',['mention', 'direct_mention','direct_message'], function(bot,message) 
{ 
    var issueNumber = message.match[1];
    controller.storage.users.get(message.user, function(err, user) {
        bot.startConversation(message, function(err, convo) {
            console.log(message);
            //helper.getPossibleAssignees(issueNumber);
            var response = fs.readFileSync('./mock_data/Ucase1_Developer_skills_and_availability_mock.json');
            var assigneeData = JSON.parse(response);
            var assignee = assigneeData.users;
            //console.log(assignee);
            var userList = [];
            assignee.forEach(function(element) {
                userList.push(element.id);
                bot.reply(message, "Emp Id: " + element.id + " Skills: " + element.skills);
                //console.log(element.skills+ " "+element.id);
            }, this);
            convo.ask("Whom do you want to assign this issue?", function(response, convo) {
                helper.isValidUser(response.text, userList).then(function (userId){
                    console.log("assigning issue");
                    convo.ask('Do you want to assign issue to ' + userId + '? Please confirm', [
                    {
                        pattern: 'yes',
                        callback: function(response, convo) {
                            //convo.say("Issue assigned to " + userId);
                            helper.assignIssueToEmp(userId, issueNumber).then(function(response){
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
                    bot.reply(message, "Cannot assign issue to given user, since it is not from given recommendation(s)");
                });
                    
            });
        });
    });
});

controller.hears('contri file (.*)',['mention', 'direct_mention','direct_message'], function(bot,message) 
{
    controller.storage.users.get(message.user, function(err, user) {
        bot.startConversation(message, function(err, convo) {
            console.log(message);
            //helper.getPossibleAssignees(issueNumber);
            var response = fs.readFileSync('./mock_data/Ucase2_list_of_commits_mock.json');
            var contriData = JSON.parse(response);
            var contributors = contriData.commits_of_a_file;
            //console.log(assignee);
            var userList = [];
            contributors.forEach(function(element) {
                userList.push(element.commit.author.name);
                bot.reply(message, "Emp Id: " + element.commit.author.name +
                                   "\nDate: " + element.commit.author.date + 
                                   "\nCommit Message: " + element.commit.message);
                //console.log(element.skills+ " "+element.id);
            }, this);
        });
    });
});

controller.hears('reviewer issue (.*)',['mention', 'direct_mention','direct_message'], function(bot,message) 
{
    var issueNumber = message.match[1];
    controller.storage.users.get(message.user, function(err, user) {
        bot.startConversation(message, function(err, convo) {
            console.log(message);
            //helper.getPossibleAssignees(issueNumber);
            var response = fs.readFileSync('./mock_data/Ucase3_list_of_reviewers.json');
            var reviewerData = JSON.parse(response);
            var reviewers = reviewerData.reviewers;
            //console.log(assignee);
            var userList = [];
            reviewers.forEach(function(element) {
                userList.push(element.id);
                bot.reply(message, "Emp Id: " + element.id + " Skills: " + element.skills);
                //console.log(element.skills+ " "+element.id);
            }, this);
            convo.ask("Whom do you want to select as a reviewer? Provide comma separated ids", function(response, convo) {
                helper.isValidUser(response.text, userList).then(function (userId){
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
                    bot.reply(message, "Cannot mark this user as a reviewer since it is not from given recommendation(s)");
                });
                    
            });
        });
    });
});

controller.hears(['.*'],['mention', 'direct_mention','direct_message'], function(bot,message) 
{
    console.log(message);
    bot.reply(message, "Wrong command");
    bot.reply(message, "Valid commands are as follows:");
    bot.reply(message, "weather");
});
