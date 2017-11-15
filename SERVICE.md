## Milestone : SERVICE

Following describes implementation flow for each usecases described in [DESIGN.md](https://github.ncsu.edu/sbshete/CSC-510-Project/blob/master/DESIGN.md)

Note : We are maintaining following database tables that will be used by bot. 
<img width="704" alt="screen shot 2017-10-25 at 8 06 44 pm" src="https://github.ncsu.edu/sbshete/CSC-510-Project/blob/milestone3/images/Database-tables.png.PNG">

**Setup :** 
* Manager must have Slack and github tokens on the system. 
* Manager must know the issue number for which an employee needs to be find. 
* Bot must know repository to work with and also verify whether the repo exists for a given 
owner.
* Whenever any issue is closed for that repository, the skillset, userID and other details must be inserted into respective database-tables in order for bot to access entries while conversation.

### Use Case 1:
Finding an employee for a new issue based on his/her skill set and deadline of issues they are currently working on : 

**Main Objective** :
 A manager requests for a list of employees that can best solve a particular open issue. Bot will return a list which will contain the the employees ordered on the basis of their skill set and the deadline of the issues they are currently working on. Manager selects an employee, the bot assigns the issue to that employee.

**Main Flow** :  
  * A manager requests for a list of employees that can best solve a particular issue. 
  * Bot needs to get details for that issue. Particularly it tries to find programming language (tag) which is related to this issue via “labels” and “issue name”. It simultaneously updates table 4 (issue_tags). 
  * After getting tags, bot gets the list of collaborators and find the 3 employees with highest tag count using table 2 (user_tags). ( Note : In simple words, tag count represents the experience of an employee in that (tag)language)
  *  Bot then asks the manager, whom to assign the issue from these 3 employees.
  *  Manager selects an employee, bot assigns the issue to that employee, updates table 3 (issue_user) and notifies him via email. 

**Alternate Flow** :
* If the issue number given by manager doesn’t exist for a given repo.
* If the manager chooses name (out of the 3 names listed by bot).

**Drawbacks**
 * Manager don’t have an option to assign issue to multiple users.


### Use Case 2: Finding major contributor who is responsible for past modifications in the code 

**Main Objective**:
  Employee provides the filename of the code requiring modifications. Bot returns contributor’s username who made major commits to that file previously. Employee asks bot to notify the contributor(concerned employee) about the same.

**Main Flow**: 
* Manager provides filename of the code requiring modifications and the bot uses git api to fetch the list of all commits along with commit messages. 
* The bot returns both: A summary of all the contributors of that code and also detailed version of the same.
* The bot then asks the manager for the employee (id) to be notified and then that contributor is notified through an email registered with his git account.

**Alternative Flow**:
* Bot checks for a valid files and returns: No such file exists in the repository. 
* Bot checks if a valid user id is entered or no from the recommendations
* It also returns and error in case there is any other issue during the conversation. 

### Use Case 3 : Finding a code reviewer for an issue

   **Main Objective** :
  A manager or an employee requests for a list of most suitable reviewers for a new commit. Bot finds the employees based on their previous experience on reviewing similar issues and the number of commits they have previously made which further shows  they can be good reviewers. 
  
   **Main Flow** : 
  * A manager requests for a list of reviewers that can best review a particular issue. 
  * Since issue was already assigned to an employee, it must have tags entry in table 4 (issue_tags). 
  * So bot needs to get details for that issue. Particularly it tries to find programming language (tag) which is related to this issue. In this scenario, it finds tags for an issue from the database-table 4 (issue_tags). 
  * After getting tags, bot gets the list of collaborators and find the 3 employees with highest *reviewer* count. 
  *  Bot then asks the manager, whom to ask to review this issue from these 3 employees.
  *  Manager selects an employee, bot assigns the reviewing task for that issue to the selected employee, updates table 5 (issue_reviewer) and notifies him via email. 

**Alternate Flow** : 
* If the issue number given by manager doesn’t exist for a given repo.
* If the manager chooses name (out of the 3 names listed by bot).











