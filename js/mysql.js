 var mysql      = require('mysql');

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'password',
  database : 'CSC_510_Project'
});

function getConnection(){
    connection.connect();
}

function getIssueTags(issueNumber){
    //connection.connect();
    var query = 'select Issue_tags from issue_table where Issue_ID=' + issueNumber;//+ ';';
    connection.query(query, function(err, rows, fields) {
        if (!err){
            var data = rows;
            console.log(data);
            for(var i=0;i<data.length;i++){
                console.log(data[i].Issue_tags.split(','));
            }
        }
        else
            console.log(err);
    });
    //connection.end();
}

function getReviewerTags(userId){
    //connection.connect();
    console.log('here 1');
    var query = 'select User_tags from user_table where User_ID=\'' + userId + '\'';
    connection.query(query, function(err, rows, fields) {
        if (!err){
            var data = rows;
            console.log(data);
            for(var i=0;i<data.length;i++){
                console.log(data[i].User_tags.split(','));
            }
        }
        else
            console.log(err);
    });
    //connection.end();
}

function insertIssueTags(data){
    //var query = 'insert into User_tags values(' + data.issueNumber + "'" + data.userId + "'" + data.issueTags + ')';
    var query = {Issue_ID: 6, User_ID:'sbshete',Issue_tags:'Java, core java, Advanced java'};
    connection.query('insert into issue_table SET ?',query, function(err, rows, fields) {
        if (!err){
            console.log('Record inserted successfully');
        }
        else
            console.log(err);
    });
}

function insertUserTags(data){
    //var query = 'insert into User_tags values(' + data.issueNumber + "'" + data.userId + "'" + data.issueTags + ')';
    var query = {User_ID:'sample',User_tags:'Java, core java, Advanced java',Email_ID:'sample@ncsu.edu'};
    connection.query('insert into user_table SET ?',query, function(err, rows, fields) {
        if (!err){
            console.log('Record inserted successfully');
        }
        else
            console.log(err);
    });
}

function updateUserTags(data){
    //var query = 'insert into User_tags values(' + data.issueNumber + "'" + data.userId + "'" + data.issueTags + ')';
    var data = {User_ID:'sbshete',User_tags:'Java, core java, Advanced java',Email_ID:'sbshete@ncsu.edu'};
    var query = "update user_table set User_tags='" + data.User_tags + "' where User_ID='" + data.User_ID + "'";
    connection.query(query, function(err, rows, fields) {
        if (!err){
            console.log('Record updated successfully');
        }
        else
            console.log(err);
    });
}

exports.getReviewerTags = getReviewerTags;
exports.getIssueTags = getIssueTags;
exports.getConnection = getConnection;
exports.insertIssueTags = insertIssueTags;
exports.insertUserTags = insertUserTags;
exports.updateUserTags = updateUserTags;