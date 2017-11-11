var mysql      = require('mysql');

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'CSC_510_Project'
});

function getConnection(){
    connection.connect();
}

function getIssueTags(issueNumber){
    //connection.connect();
    var query = 'select tags from issue_tags where Issue_ID=' + issueNumber;//+ ';';
    connection.query(query, function(err, rows, fields) {
        if (!err){
            var data = rows;
            console.log(data);
            for(var i=0;i<data.length;i++){
                console.log(data[i].Issue_tags);
            }
        }
        else
            console.log(err);
    });
    //connection.end();
}

function getUserTagsCount(userList, tagsList){
    return new Promise(function(resolve, reject){
        var data = {};
        console.log("get tag count");
        var i=0;
        var userProcessed = 0;
        for(var i=0;i<userList.length;i++){
            UserTagsCount(userList[i], tagsList).then(function(userCount){
                data[userCount.split(":")[0]] = userCount.split(":")[1];
                console.log("pushing data");
                console.log("user: ", userCount.split(":")[0]);
                console.log(data);
                userProcessed++;
                if(userProcessed == userList.length){
                    console.log("user: ", userProcessed);
                    resolve(data);
                }
            });
        }
        console.log("data: ", data);
        //resolve(data);
    });
}

function UserTagsCount(user, tagsList){
    //connection.connect();
    //tagsList = ['c++','java'];
    //userList = ['sbshete','sagupta'];
    return new Promise(function(resolve, reject){
        //var query = "select User_ID, count(skill) as skillCount from user_tags where User_ID in ('" + userList.join("','") + "')" +
        //            "and skill in ('" + tagsList.join("','") + "') group by User_ID order by count(skill) desc limit 3";
        var query = "select count(distinct a.User_ID, b.Issue_ID) as numOfIssues from user_tags as a,"+
                    "(select Issue_ID, tags from issue_tags where Issue_id in "+
                    "(select Issue_ID from issue_assignee where User_Id='"+ user + "')) as b where a.skill=b.tags"+
                    " and User_Id='" + user + "' and b.tags in('" + tagsList.join("','") + "');";
        console.log(query);
        var assigneeList = [];
        connection.query(query, function(err, rows, fields) {
            if (!err){
                //var data = rows;
                console.log('in here');
                console.log(rows);
                // for(var i=0;i<rows.length;i++){
                //     console.log(rows[i].User_ID+ " " + rows[i].skillCount);
                //     assigneeList.push(rows[i].User_ID);
                // }
                // resolve(assigneeList);
                resolve(user+":"+rows[0].numOfIssues);
            }
            else{
                console.log(err);
                reject("Error while fetching user-tags details");
            }   
        });
    });
    //connection.end();
}

function insertIssueTags(data){
    var query = 'insert into issue_tags VALUES(' + data[0] + "," + "'" + data[1] + "'" + ')';
    connection.query(query, function(err, rows, fields) {
        if (!err){
            console.log('Record inserted successfully');
        }
        else
            console.log(err);
    });
}

function insertIssueAssignee(data){
    var query = 'insert into issue_assignee VALUES(' + data[0] + "," + "'" + data[1] + "'" + ')';
    connection.query(query, function(err, rows, fields) {
        if (!err){
            console.log('Record inserted successfully');
        }
        else
            console.log(err);
    });
}

function insertUserTags(data){
    var query = 'insert into user_tags VALUES(' + "'" + data[0] + "'" + "," + "'" + data[1] + "'" + ')';    
    connection.query(query, function(err, rows, fields) {
        if (!err){
            console.log('Record inserted successfully');
        }
        else
            console.log(err);
    });
}

exports.getUserTagsCount = getUserTagsCount;
exports.getIssueTags = getIssueTags;
exports.getConnection = getConnection;
exports.insertIssueTags = insertIssueTags;
exports.insertUserTags = insertUserTags;
exports.insertIssueAssignee = insertIssueAssignee;