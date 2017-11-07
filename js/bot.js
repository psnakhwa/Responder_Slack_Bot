var Botkit = require('botkit');
var Forecast = require('forecast.io');
var options = {APIKey:process.env.FORECASTTOKEN};
var forecast = new Forecast(options);
var Forecast = require('forecast.io');
var options = {APIKey:process.env.FORECASTTOKEN};
//var helper = require("./helper.js")
var _ = require("underscore");
var request = require('request');
var fs = require("fs");
var Promise = require('bluebird');
var parse = require('parse-link-header');
var urlRoot = "https://github.ncsu.edu/api/v3";
//var childProcess = require("child_process");
var helper = require("./closeissue.js");
var isd = require("./issuedetails.js");

//Enter the value of variables below where <> is marked
var userId = "dupandit";
var repoName = "Sample-mock-repo"   //Your already created Repo name
//var repo = "<enter a repo that you want to create>" //name of the repo that you want to createElement
var issue_number = "2"
var token = "token " + "9a4e59bc779a095357f239af7e84e45b6d830703";








var controller = Botkit.slackbot({
  debug: false
  //include "log: false" to disable logging
  //or a "logLevel" integer from 0 to 7 to adjust logging verbosity
});

// connect the bot to a stream of messages
controller.spawn({
  token: process.env.SLACKTOKEN
}).startRTM()

//
// controller.hears('what',['mention', 'direct_mention','direct_message'], function(bot,message)
// {
//   var latitude = "48.208579"
//   var longitude = "16.374124"
//   forecast.get(latitude, longitude, function (err, res, data)
//   {
//         if (err) throw err;
//
//         //console.log('res: ' + JSON.stringify(res));
//         //console.log('data: ' + JSON.stringify(data));
//         var w = data.currently.summary + " and feels like " + data.currently.apparentTemperature;
//         console.log(w);
//         bot.reply(message,w);
//         //return (w)
//       //  callback(w);
//   });
//
//
//
// });
// // give the bot something to listen for.
// //controller.hears('string or regex',['direct_message','direct_mention','mention'],function(bot,message) {
// controller.hears('weather',['mention', 'direct_mention','direct_message'], function(bot,message)
// {
//   console.log(message);
//   bot.reply(message,"The weather is great");
//
// });

controller.hears('I want to close an issue',['mention', 'direct_mention','direct_message'], function(bot,message)
{
      bot.api.users.info({user:message.user}, function(err, response) {
      let {name, real_name} = response.user;
      bot.startConversation(message, function(err, convo) {
          bot.reply(message,"Hello "+name+"!");
          convo.activate();
          convo.ask('Which issue do you want to close ? ',function(response,convo) {

          number = response.text;
          //console.log(typeof(number))
          convo.say('OK,closing issue no ' + number + '!');


          //First close the issue
          helper.ClosetheIssue(userId,repoName,number).then(function(response){
              console.log("issue no "+ number + " closed !");
              bot.reply(message, response);
          }).catch(function(err){
              bot.reply(message, error);
          });


          // Store skills and username in database
          isd.getIssueDetails(userId,repoName,number).then(function(response){
              console.log(response);
              bot.reply(message, response);
          }).catch(function(err){
              bot.reply(message, error);
          });

          convo.next();
          })


          });
      });
  });


controller.hears('collaborators',['mention', 'direct_mention','direct_message'], function(bot,message)
{
  //console.log('Hi')
  bot.reply(message,'Hi')
  var request = require('request');
  var fs = require("fs");
  var Promise = require('bluebird');
  var parse = require('parse-link-header');
  var urlRoot = "https://github.ncsu.edu/api/v3";

  // Enter the value of variables below where <> is marked
  var userId = "dupandit";
  var repoName = "Sample-mock-repo"   //Your already created Repo name
  //var issue_number = "<enter the issue number>"
  var token = "token " + "b6671e2fdab5d56f284d839f025e5c42aa30de4c";
  //var obj = helper.Listofcommits(userId,repoName);
  //console.log(obj);
  //obj = JSON.parse(mock_u2.myFun)
  helper.getCollaborators("dupandit","Sample-mock-repo").then(function (collaborators)
  {
    var collabs = _.pluck(collaborators,"login");
    console.log("The collaborators are:" + collabs);
    bot.reply(message,"collaborators are : " + collabs);
  });
})


controller.hears('number',['mention', 'direct_mention','direct_message'], function(bot,message)
{
  //console.log('Hi')
  bot.reply(message,'Hi')
  var request = require('request');
  var fs = require("fs");
  var Promise = require('bluebird');
  var parse = require('parse-link-header');
  var urlRoot = "https://github.ncsu.edu/api/v3";

  // Enter the value of variables below where <> is marked
  var userId = "dupandit";
  var repoName = "Sample-mock-repo"   //Your already created Repo name
  //var issue_number = "<enter the issue number>"
  var token = "token " + "b6671e2fdab5d56f284d839f025e5c42aa30de4c";
  //var obj = helper.Listofcommits(userId,repoName);
  //console.log(obj);
  //obj = JSON.parse(mock_u2.myFun)
  helper.getIssueDetails("dupandit","Sample-mock-repo",1).then(function (issueList)
  {
    //var issue_details = _.pluck(issueList,"");
    var issue_details = JSON.stringify(issueList)
    console.log("The details for issue 1 are:" + issue_details );
    bot.reply(message,"The details for issue 1 are: " + issue_details);
  });
})






controller.hears('issues',['mention', 'direct_mention','direct_message'], function(bot,message)
{
  //console.log('Hi')
  bot.reply(message,'Hi')
  var request = require('request');
  var fs = require("fs");
  var Promise = require('bluebird');
  var parse = require('parse-link-header');
  var urlRoot = "https://github.ncsu.edu/api/v3";

  // Enter the value of variables below where <> is marked
  var userId = "dupandit";
  var repoName = "Sample-mock-repo"   //Your already created Repo name
  //var issue_number = "<enter the issue number>"
  var token = "token " + "b6671e2fdab5d56f284d839f025e5c42aa30de4c";
  //var obj = helper.Listofcommits(userId,repoName);
  //console.log(obj);
  //obj = JSON.parse(mock_u2.myFun)
  helper.Listofissues("dupandit","Sample-mock-repo").then(function (issueList)
  {
    var issuel = _.pluck(issueList,"number");
    console.log("The issues are:" + issuel);
    bot.reply(message,"The issues are : " + issuel);
  });
})












controller.hears('give me a list of commit',['mention', 'direct_mention','direct_message'], function(bot,message)
{
  //console.log('Hi')
  bot.reply(message,'Hi')
  var request = require('request');
  var fs = require("fs");
  var Promise = require('bluebird');
  var parse = require('parse-link-header');
  var urlRoot = "https://github.ncsu.edu/api/v3";

  // Enter the value of variables below where <> is marked
  var userId = "dupandit";
  var repoName = "Sample-mock-repo"   //Your already created Repo name
  //var issue_number = "<enter the issue number>"
  var token = "token " + "b6671e2fdab5d56f284d839f025e5c42aa30de4c";
  //var obj = helper.Listofcommits(userId,repoName);
  //console.log(obj);
  //obj = JSON.parse(mock_u2.myFun)
  helper.Listofcommits("dupandit","Sample-mock-repo").then(function (commits_of_a_file)
  {
    var comm = _.pluck(commits_of_a_file,"commit");
    console.log("The commits are done by:" + comm[0].author.name + ' ' + comm[1].author.name + ' ' + comm[2].author.name );
    bot.reply(message,"The issues are : " + comm[0].author.name + ' ' + comm[1].author.name + ' ' + comm[2].author.name);
  });
})















//////////////////////////// Ignore This /////////////////////////////////////////////////////////////////////


controller.hears('open issues',['mention', 'direct_mention','direct_message'], function(bot,message)
{
  //Initialization
  var request = require('request');
  var fs = require("fs");
  var Promise = require('bluebird');
  var parse = require('parse-link-header');
  var urlRoot = "https://github.ncsu.edu/api/v3";

  // Enter the value of variables below where <> is marked
  var userId = "dupandit";
  var repoName = "Sample-mock-repo"   //Your already created Repo name
  //var issue_number = "<enter the issue number>"
  var token = "token " + "b6671e2fdab5d56f284d839f025e5c42aa30de4c";

  listIssues(userId,repoName);

  function listIssues(owner,repo)
  {
  	console.log('Getting a list of open issues of your public repo\n\n')
    bot.reply(message,'Getting a list of open issues of your public repo\nPlease Wait....\n')
    console.log('Owner :'+userId+'\n')
    bot.reply(message,'Owner :'+userId+'\n')

  	var options = {
  		url: urlRoot + '/repos/'+owner+'/'+repo+'/issues',
  		method: 'GET',
  		headers: {
  			"User-Agent": "EnableIssues",
  			"content-type": "application/json",
  			"Authorization": token
  		}
  	};

  	// Send a http request to url and specify a callback that will be called upon its return.
  	request(options, function (error, response, body)
  	{
  		var obj = JSON.parse(body);
  		//console.log( obj );
  		count=1

  		for( var i = 0; i < obj.length; i++ )
  		{
        //if (obj.state == "open")
        //{
    			var name = obj[i].title;
          var issue_no = obj[i].number;
          var skills = obj[i].labels[0].name
          console.log(count+'. '+'issue number : '+issue_no +'\n    '+ " title :" +name+'\n     '+ "skills : " + skills + '\n    ' );
          bot.reply(message,count+'. '+'issue number : '+issue_no +'\n    '+ " title :" +name+'\n     '+ "skills : " + skills +  '\n    ');
    			count=count+1
        //}
  		}
  	});
  }
////////////////////////////////////////////////////////////////////////////

// controller.hears('commits issues',['mention', 'direct_mention','direct_message'], function(bot,message)
// {
//   //Initialization
//   console.log('Hi')
//   bot.reply(message,'Hi')
//   var request = require('request');
//   var fs = require("fs");
//   var Promise = require('bluebird');
//   var parse = require('parse-link-header');
//   var urlRoot = "https://github.ncsu.edu/api/v3";
//
//   // Enter the value of variables below where <> is marked
//   var userId = "dupandit";
//   var repoName = "Sample-mock-repo"   //Your already created Repo name
//   //var issue_number = "<enter the issue number>"
//   var token = "token " + "b6671e2fdab5d56f284d839f025e5c42aa30de4c";
//
//   console.log(mock_u2.Listofcommits(userId,repoName));
//
//
// })
})
