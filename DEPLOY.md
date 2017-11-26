### Deployment

### Acceptance Testing

[This]() is a link to our slack team. You can get login credentials [here](). Start the conversation in #general using *'@Trazibot'*. <br />
Following are the acceptance test instructions for each usecase :

#### Initial Testing

* Say *hi/hello @traziBot", so bot will know you are the manager with whom he will work with.
* Wait for bot to respond and then give the repo name to work with. 
* As a simple step of authentication, bot will ask the owner of this repo.
* If they match, bot will list all the commands for each usecase it can perform.
* We are maintaining [following](https://github.ncsu.edu/sbshete/CSC-510-Project/blob/milestone3/database/database.md) database tables, we talked about updation of db in [Service.md](https://github.ncsu.edu/sbshete/CSC-510-Project/blob/milestone3/SERVICE.md). So as a initial testing we will check whether the table issue_assignee, issue_tags, user_tags gets updated with a valid entry whenever an issue is closed. (we discussed about creation of hook for closed issue).

#### Usecase 1 Testing
* Create an issue, with the required skillset in name as well as label. Go to mysql and check the current user_tags table using *select * user_tags* command. One can figure it out or note it down which employee can be assigned to the following issue.
* We will request for a list of employees that can best solve a particular issue using command *find assignee for issue <no>*.
* We know the bot needs to get details for that issue. Particularly it tries to find skills which are related to this issue via “labels” and “issue name and description”. After getting tags, bot should list names of 3 employees with highest tag count.
* Bot should then ask whom to assign the issue from these 3 employees.
* We select an employee by providing its name as one listed by bot previously and bot assigns the issue to that employee. We can check the corresponding issue manually and check the assignee.
* Bot also updates table "issue_assignee" and notifies him via email. One can check the table using *select * issue_assignee* command.

[Alternate Flow] :
* If the issue number given by manager doesn’t exist for a given repo bot should reply that "issue does not exist"
* Bot should throw an error when repo name and owner of the repo doesn't match.


#### 
