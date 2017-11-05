create database CSC-510-Project;
use CSC_510_Project;
create table user_table(User_ID varchar(255) NOT NULL, User_tags varchar(255), Email_ID varchar(255), PRIMARY KEY (User_ID));
create table issue_table(Issue_ID int NOT NULL, User_ID varchar(255), Issue_tags varchar(255), PRIMARY KEY (Issue_ID),FOREIGN KEY (User_ID) REFERENCES user_table(User_ID));
