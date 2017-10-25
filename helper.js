// for finding list of people who can work on current repo
var repoName =  "TraziBot-Testing";
var token = "token " + process.env.GITHUB_TOKEN;
var urlRoot = "https://github.ncsu.edu/api/v3";
var userId = "sushantgupta1206";

/**
 * @desc  
 * @param 
 * @return 
 */

// manager passes his git token (repo) : bot returns all the repos manager is a part of 
function getAllrepos(){
    //get all the repos where manager is a collaborator
    // pass all the repos from this function into the get collaborators function
}
//using these repos get a list of all employees who have contributed to the projects
function callGetCollaborator(){
    //var repoName =  "TraziBot-Testing";
   //var token = "token " + process.env.GITHUB_TOKEN;
    //var urlRoot = "https://github.ncsu.edu/api/v3";
    //var userId = "sushantgupta1206";
        
   getCollaborators(userId,repoName);    
}

function getCollaborators(userName, repoName){

    var options = { //dictionary
       url: urlRoot + '/repos/' + userName + "/" + reposName + "/collaborators",
       ///repos/:owner/:repo/collaborators    
        method: 'GET',
                headers: {
                     "User-Agent": "EnableIssues",
                     "content-type": "application/json",
                     "Authorization": token
                 }
            };
        
             // Send a http request to url and specify a callback that will be called upon its return.
             request(options, function (error, response, body) {
                 var obj = JSON.parse(body);
                 //console.log( obj );
                 for (var i = 0; i < obj.length; i++) {
                     var name = obj[i].name;
                     console.log(name);
                 }
             });
        

    //send git repo name to get all colloborators
    console.log("getCollaborators start");
    //bot.reply("this is the list of colloboprators");
    console.log("getCollaborators end");
}

/**
 * @desc  
 * @param 
 * @return 
 */
function assignIssueToEmp(){
    console.log("assignIssueToEmp start");
    console.log("assignIssueToEmp end");
} 

exports.getCollaborators = getCollaborators;
exports.assignIssueToEmp = assignIssueToEmp;