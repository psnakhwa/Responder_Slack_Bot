create database CSC-510-Project;
use CSC_510_Project;
create table user_table(User_ID varchar(255) NOT NULL, User_tags varchar(255), Email_ID varchar(255), PRIMARY KEY (User_ID));
create table issue_table(Issue_ID int NOT NULL, User_ID varchar(255), Issue_tags varchar(255), PRIMARY KEY (Issue_ID),FOREIGN KEY (User_ID) REFERENCES user_table(User_ID));
insert into user_table values ("asagarwa","python,java","asagarwa@ncsu.edu"),("psnakhwa","python,node","psnakhwa@ncsu.edu"),("sbshete","c++,java","sbshete@ncsu.edu"),("sagupta","ruby,java","sagupta@ncsu.edu"),("dupandit","c,c++","dupandit@ncsu.edu");
insert into issue_table values ("1","sbshete","c++"),("2","asagarwa","python,java"),("3","dupandit","c,c++,c#"),("4","sagupta","ruby,java,python"),("5","sbshete","c++,java");
