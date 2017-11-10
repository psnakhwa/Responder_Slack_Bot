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
    //connection.connect();
    //tagsList = ['c++','java'];
    //userList = ['sbshete','sagupta'];
    return new Promise(function(resolve, reject){
        var query = "select User_ID, count(skill) as skillCount from user_tags where User_ID in ('" + userList.join("','") + "')" +
                    "and skill in ('" + tagsList.join("','") + "') group by User_ID order by count(skill) desc limit 3";
        console.log(query);
        var assigneeList = [];
        connection.query(query, function(err, rows, fields) {
            if (!err){
                //var data = rows;
                console.log('in here');
                console.log(rows);
                for(var i=0;i<rows.length;i++){
                    console.log(rows[i].User_ID+ " " + rows[i].skillCount);
                    assigneeList.push(rows[i].User_ID);
                }
                resolve(assigneeList);
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