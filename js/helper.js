// for finding list of people who can work on current repo
var repoName =  "TraziBot-Testing";
var token = "token " + process.env.GITHUB_TOKEN;
var urlRoot = "https://github.ncsu.edu/api/v3";
   

/**
 * @desc  
 * @param 
 * @return 
 */
function getCollaborators(){
    console.log("getCollaborators start");
    console.log("getCollaborators end");
}

/**
 * @desc this will assign userId to issueNumber
 * @param userId emp to whom we will assign an issue
 * @param issueNumber issue to assigned
 * @return 
 */
function assignIssueToEmp(userId, issueNumber){
    console.log("assignIssueToEmp start");
    return new Promise(function(resolve, reject){
        resolve("Issue " + issueNumber + " assigned to " + userId);
    });
    console.log("assignIssueToEmp end");
} 


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

}

function isValidUser(userId, userList){
    console.log("isValidUser start");
    // if(userList.indexOf(userId)>-1){
    //     return true;
    // }
    // return false;
    // console.log("isValidUser end");
    return new Promise(function (resolve, reject)
	{
         if(userList.indexOf(userId)>-1){
            resolve(userId);
        }
        reject(userId);
    });
}

exports.getCollaborators = getCollaborators;
exports.assignIssueToEmp = assignIssueToEmp;
exports.isValidUser = isValidUser;
exports.getPossibleAssignees = getPossibleAssignees;
exports.assignReviewerForIssue = assignReviewerForIssue;