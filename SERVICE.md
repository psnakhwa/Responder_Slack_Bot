## Milestone : SERVICE

This document describes the implementation and flow for each usecase written in previous milestones [DESIGN.md](https://github.ncsu.edu/sbshete/CSC-510-Project/blob/master/DESIGN.md)  

**Setup : Assumptions** 
* Manager must have Slack and github tokens on the system. 
* Manager must know the issue number for which an employee needs to be find. 
* Bot must know repository to work with and also verify whether the repo exists for a given 
owner.
* Whenever any issue is closed for that repository, the skillset, userID and other details must be inserted into respective database-tables in order for bot to access entries while conversation.

**Setup: Process:**  
* Clone the repo  ```git clone https://github.ncsu.edu/sbshete/CSC-510-Project.git```  
* Switch to milestone3 branch  ```git checkout milestone3```  
* Change directory to js  ```cd js```  
* Install packages  ```npm install```  
* Set environment variables     
>* BOT_TOKEN (your_slack_token)  
>* GITHUB_TOKEN (your_github_token)  
>* USER_TOKEN (bot_email_id)  
>* PASS_TOKEN (bot_email_password)  
  
* Start mysql database server (commands can be system specific)  
* In mysql run this [script](database/db.sql) to create the schema **(Note: We are maintaining [database tables](database/database.md) that will be used by bot)**  
* Run ```node traziBot.js``` to start slack bot  
* Enter “hi” or “hello” to initiate the bot and follow instructions to set the “repositry” and “owner” to work with.  
* For the use case 1, command is: find assignee for issue <issue number>  
* For the use case 2, command is: find contributors for file <filename.ext>  
* For the use case 3, command is: find reviewers for issue <issue number>  

## Implementation Descriptions:

### Use Case 1: Finding an employee for a new issue based on his/her skill set

**Main Objective** :
A manager requests for a list of employees that can best solve a particular open issue. Bot will return a list which will contain the the employees ordered on the basis of their skill set and the deadline of the issues they are currently working on. Manager selects an employee, the bot assigns the issue to that employee.

**Main Flow** :  
  * A manager requests for a list of employees that can best solve a particular issue. 
  * Bot needs to get details for that issue. Particularly it tries to find skills which are related to this issue via “labels” and “issue name and description”.
  * After getting tags, bot gets the list of collaborators and find the 3 employees with highest tag count using table "user_tags". ( Note : In simple words, tag count represents the experience of an employee in that skillset)
  *  Bot then asks the manager, whom to assign the issue from these 3 employees.
  *  Manager selects an employee, bot assigns the issue to that employee, updates table "issue_assignee" and notifies him via email. 

**Alternate Flow** :
* If the issue number given by manager doesn’t exist for a given repo bot replies that "issue does not exist"
* Bot checks if a valid user id is entered or not from the recommendations and re-asks for a valid user. 

**Constraint**
 * Manager cannot assign issue to multiple users.


### Use Case 2: Finding major contributor who is responsible for past modifications in the code 

**Main Objective**:
Employee provides the filename of the code requiring modifications. Bot returns contributor’s username who made major commits to that file previously. Employee asks bot to notify the contributor(concerned employee) about the same.

**Main Flow**: 
* Manager provides filename of the code requiring modifications and the bot uses git api to fetch the list of all commits along with commit messages. 
* The bot returns both: A summary of all the contributors of that code and also detailed version of the same.
* The bot then asks the manager for the employee (id) to be notified and then that contributor is notified through an email registered with his git account.

**Alternative Flow**:
* Bot checks for a valid files and returns "No such file exists in the repository" if invalid filename
* Bot checks if a valid user id is entered or not from the recommendations and re-asks for a valid user.

### Use Case 3 : Finding a code reviewer for an issue

**Main Objective** :
A manager or an employee requests for a list of most suitable reviewers for a new commit. Bot finds the employees based on their previous experience on reviewing similar issues and the number of commits they have previously made which further shows  they can be good reviewers. 
  
**Main Flow** : 
  * A manager requests for a list of reviewers that can best review a particular issue. 
  * Since issue was already assigned to an employee, it must have tags entry in table "issue_tags". 
  * So bot needs to get details for that issue. Particularly it tries to find skills which are related to this issue. In this scenario, it finds tags for an issue from the database-table "issue_tags". 
  * After getting tags, bot gets the list of collaborators and find the 3 employees with highest *reviewer* count. 
  * Bot also get some of the top employees who have solved the issues with similar skill set.
  * Bot then asks the manager, whom to ask to review this issue from these 3 employees.
  * Manager select an employees, bot assigns the reviewing task for that issue to the selected employees, updates table "issue_reviewer" and notifies all via email. 

**Alternate Flow** : 
* If the issue number given by manager doesn’t exist for a given repo bot replies that "issue does not exist"
* Bot checks if a valid user id is entered or not from the recommendations and re-asks for a valid user. 
