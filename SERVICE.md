## Milestone : SERVICE

Following describes implementation flow for each usecases described in [DESIGN.md](https://github.ncsu.edu/sbshete/CSC-510-Project/blob/master/DESIGN.md)

**Setup** :
* Manager must have Slack and github tokens on the system. 
* Manager must know the issue number for which an employee needs to be find. 
* Bot must know repository to work with and also verify whether the repo exists for a given owner.
* Whenever any issue is closed for that repository, the skillset, userID and other details must be inserted into respective database-tables in order for bot to access entries while conversation.

Note : We are maintaining following database tables that will be used by bot. 
<img width="704" alt="screen shot 2017-10-25 at 8 06 44 pm" src="https://github.ncsu.edu/sbshete/CSC-510-Project/blob/milestone3/images/Database-tables.png.PNG">

**Main Flow** : 

###Use Case 1: Finding an employee for a new issue based on his/her skill set and deadline of issues they are currently working on

  * A manager requests for a list of employees that can best solve a particular issue. 
  * Bot needs to get details for that issue. Particularly it tries to find programming language (tag) which is related to this issue via labels and issue name. It simultaneously updates table 4 (issue_tags). 
  * After getting tags, bot gets the list of collaborators and find the 3 users with highest tag count using table 2 (user_tags). 
  *  Bot then asks the manager, whom to assign the issue from these 3 users.
  *  Manager selects a user, bot assigns the issue to particular user, updates table 3 (issue_user) and notifies that user via email

