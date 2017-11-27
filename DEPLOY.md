### Deployment

### Acceptance Testing

[This]() is a link to our slack team. You can get login credentials [here](). Start the conversation in #general using *'@Trazibot'*. <br />
[This](https://github.ncsu.edu/dupandit/Sample-mock-repo) is a link to our sample repo for testing. It is recommended to create 2-3 issues with valid name(including skill as a word) as well as similar label before testing. 
Following are the acceptance test instructions for each usecase :

#### Initial Testing

* Say "hi/hello @traziBot", so bot will know you are the manager with whom he will work with.
* Wait for bot to respond and then give the repo name to work with as "Sample-mock-repo". 
* As a simple step of authentication, bot will ask the owner of this repo. Owner of "Sample-mock-repo" is "dupandit".
* If they match, bot will list all the commands for each usecase it can perform.
* We are maintaining [following](https://github.ncsu.edu/sbshete/CSC-510-Project/blob/milestone3/database/database.md) database tables, we talked about updation of db in [Service.md](https://github.ncsu.edu/sbshete/CSC-510-Project/blob/milestone3/SERVICE.md). So as a initial testing we will check whether the table issue_assignee, issue_tags, user_tags gets updated with a valid entry whenever an issue is closed. (we discussed about creation of hook for closed issue).

[Alternate Flow]:
* Bot should throw an error when repo name and owner of the repo doesn't match.

#### Usecase 1 Testing
* Create an issue, with the required skillset in name as well as label. Go to mysql and check the current user_tags table using *select * user_tags* command. One can figure it out or note it down which employee can be assigned to the following issue.
* We will request for a list of employees that can best solve a particular issue using 1st valid command *find assignee for issue <no>*.
* We know the bot needs to get details for that issue. Particularly it tries to find skills which are related to this issue via “labels” and “issue name and description”. After getting tags, bot should list names of 3 employees with highest tag count.
* Bot should then ask whom to assign the issue from these 3 employees.
* We select an employee by providing its name as one listed by bot previously and bot assigns the issue to that employee. We can check the corresponding issue manually and check the assignee.
* Bot also updates table "issue_assignee" and notifies him via email. One can check the table using *select * issue_assignee* command.

[Alternate Flow] :
* If the issue number given by us doesn’t exist for a given repo bot should reply that "issue does not exist"
* If the id of the selected employee is not from the given recommendations, bot will prompt you to put correct id. Failure of that will not allow you to proceed forward or even implement usecase 2 or 3.

#### Usecase 2 Testing
* We should provide bot, filename of the code requiring modifications using 2nd valid command * find contributors for file*.
* bot uses git api to fetch the list of all commits along with commit messages.
* The bot should returns both: A summary of all the contributors of that code and also detailed version of the same.
* The bot should then ask the manager for the employee (id) to be notified.
* We can select employee based on highest contribution or rather total number of commits by providing id as listed by the bot.Bot shoul confirm our selection.
* Bot should then that contributor is notified through an email registered with his git account.

[Alternate Flow]:
* Bot should check for a valid file. It should return "No such file exists in the repository" if invalid filename provided.
* Bot should checks if a valid user id is entered. It should reask if not from the recommendations.

### Usecase 3 Testing
* Create an issue, with the required skillset in name as well as label. Go to mysql and check the current issue_tags and issue_reviewers table using *select * <tablename* command. One can figure it out or note it down which reviewer can be assigned to the following issue and can also see that currently there is not entry for this issue in issue_reviewer table.
* We can request for a list of reviewers that can best review a particular issue using *find reviewers for issue <no>* command.
* Now we should note here that this issue was already assigned to an employee previously, that's why want a reviewing. So we should check whether it has tags entry in table "issue_tags".
* Similar to usecase 1, bot needs to get details for that issue. Particularly it tries to find skills which are related to this issue. In this scenario, it finds tags for an issue from the database-table "issue_tags".
* After getting tags, bot should get the list of collaborators and find the employees with highest reviewer count if there are any reviewing entries in the table.
* Bot should also list top employees who have solved the issues with similar skill set. By this bot makes sure that it provides some useful names to us even though they haven't reviewed previously.
* Bot should then ask whom to ask to review this issue from these employees.
* We select an employee/em, bot assigns the reviewing task for that issue to the selected employees.
* To verify this, we know that bot updates table "issue_reviewer", we can check that table in mysql using command *select * issue_reviewer* 
* Bot should then notify that reviewer via email.
  
[Alternate Flow] :
* If the issue number given by us doesn’t exist for a given repo bot should reply that "issue does not exist"
* If the id of the selected employee is not from the given recommendations, bot will prompt you to put correct id. Failure of that will not allow you to proceed forward or even implement usecase 1 or 2.
  


