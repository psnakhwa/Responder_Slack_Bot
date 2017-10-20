var helper = require("./helper.js")
var os = require('os');

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
    helper.getCollaborators();
    findRelative
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