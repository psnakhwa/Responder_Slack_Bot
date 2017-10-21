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
 * @desc  
 * @param 
 * @return 
 */
function assignIssueToEmp(){
    console.log("assignIssueToEmp start");
    console.log("assignIssueToEmp end");
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