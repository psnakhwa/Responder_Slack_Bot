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

controller.hears('assignee issue (.*)',['mention', 'direct_mention','direct_message'], function(bot,message) 
{ 
    // helper.getCollaborators();
    controller.storage.users.get(message.user, function(err, user) {
        bot.startConversation(message, function(err, convo) {
            console.log(message);
            var response = fs.readFileSync('../mock_u1.json');
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
                            convo.say("Issue assigned to " + userId);
                            convo.next();
                        }
                    }]);
                    convo.next();
                }).catch(function (e){
                    bot.reply(message, "user not from recommendations");
                });
                    
            });
        });
    });
    // findRelative
    
    //bot.reply(message, assigneeData.users);
});

controller.hears('contributors file (.*)',['mention', 'direct_mention','direct_message'], function(bot,message) 
{

});

controller.hears('reviewer issue (.*)',['mention', 'direct_mention','direct_message'], function(bot,message) 
{
    
});

controller.hears(['.*'],['mention', 'direct_mention','direct_message'], function(bot,message) 
{
    console.log(message);
    bot.reply(message, "Wrong command");
    bot.reply(message, "Valid commands are as follows:");
    bot.reply(message, "weather");
});