## Trazi Bot

Trazi Bot finds appropriate assignees for various issues as well as code reviews and recommend them to the manager and thus reduce manager’s workload.

#### The problem your bot solved

Nowadays, a major concern for all the managers in any software company is to find the people to work on new as well as existing issues in a project. It is also an extremely tedious task for the manager to manually ensure that all the employees are not just assigned to an issue but are also working on the issues which are the best possible assignment for them as per their potential. Under utilization (inefficient resource allocation) of an employee’s potential can be considered as a wastage of critical company resources.
Secondly, when an employee is assigned to work on an existing issue he/she needs an understanding of the code and associated errors previously worked upon by another team member which becomes tough for him to identify. A solution for this will quickly ensure peer-mapping and reduce effort to understand the code.
Thirdly, it is hard to find the right developer who can review the code written by other employees. Code review is critical to maintain the standard of code that goes in production. So, to find the right person for a particular task is a major challenge that needs to be addressed as effectively as possible.

#### Primary features and screenshots.

One can find our Trazibot code [here](https://github.ncsu.edu/sbshete/CSC-510-Project/blob/milestone-report/js/traziBot.js) and its helper file [here](https://github.ncsu.edu/sbshete/CSC-510-Project/blob/milestone-report/js/helper.js). Primary features that are implemented are : 

Finding an employee for a new issue based on his/her skill set. 

![alt text](https://github.ncsu.edu/sbshete/CSC-510-Project/blob/milestone-deploy/images/Screen%20Shot%202017-11-28%20at%2010.51.14%20PM.png)
 
Finding major contributor who is responsible for past modifications in the code

![alt text](https://github.ncsu.edu/sbshete/CSC-510-Project/blob/milestone-deploy/images/Screen%20Shot%202017-11-28%20at%2010.56.18%20PM.png)

![alt text](https://github.ncsu.edu/sbshete/CSC-510-Project/blob/milestone-deploy/images/Screen%20Shot%202017-11-28%20at%2010.56.34%20PM.png)
  
Finding a code reviewer for an issue. 

![alt text](https://github.ncsu.edu/sbshete/CSC-510-Project/blob/milestone-deploy/images/Screen%20Shot%202017-11-28%20at%2010.58.41%20PM.png)
 
We are maintaining [following](https://github.ncsu.edu/sbshete/CSC-510-Project/blob/milestone3/database/database.md) database tables in order to find employees based on her skillset and in a similar way for reviewer. We are also maintaining database table with email id of each employee in order to notify him/her.

For insertion of entries in the database tables, we have created a [webhook](https://github.ncsu.edu/sbshete/CSC-510-Project/blob/milestone-report/js/server.js) which triggers whenever an issue is closed.


#### Reflection on the development process

* The development process for this project was challenging but every milestone involved lots of learning like first milestone was the most important part as it involved brainstorming to frame our actual problem statement as well as thinking of appropriate solutions without much knowledge of existing technology. 
* Second milestone involved setting up bot environment in slack environment and develop mock based interaction. Here we actually thought and finalized our actual implementation, architecture and technologies. 
* In milestone 3, we finally implemented internal logic that we brainstormed throughout the first 3 milestones to perform actual services of the bot. 
* As suggested throughout this project, we made use of agile methodology to understand our problem initially and daily meetings also reduced the chances of implementation error during each milestones. We used pair-programming during our actual implementation of Milestone 3 as it would speed up each assigned task as well as simultaneous debugging. 
* Instead of approaching a hierarchical grouping, we actually worked in a flexible manner knowing strong and weak points of ourself as well as team members. 
* Early completion of one’s task would also encourage him to extend his helping hand to contribute to other tedious tasks.
* We would also set deadlines for each assigned task on trello task tracking which would also remind each one about the deadline. 

#### Limitations and Future Work

Because of time constraints and course based project requirements, we were only able to solve primary problem of finding people for issues for manager. However in Software Engineering world, there is much more that needs to be considered for trazibot while finding people and assigning issues to them. <br/>
<br />
Following are the Limitations : <br /> 
* Trazibot only supports Github as repository hosting service for assigning issues.
* Only skillset is considered while choosing an assignee. So if two different issues have similar name and description, trazibot will still recommend the same person who was assigned the first issue, which is actually a major problem. 
* Trazibot assumes that issue created always have skill or technology or rather programming language mentioned in either its name or description, which is user controlled. So if user doesn’t mention programming language or technology used while raising the issue, trazibot might not be able to suggest possible assignees.
* For user details in trazibot’s database, it relies on the webhook that was created when issue is closed. So initially if the repository have no issues raised bot will have no details and will not be able to recommend assignees. For that case, we assume it already has some static entries to recommend assignees to user initially. <br />
<br />
There are lot of factors that can improve efficiency and performance of trazibot. Some of them are listed below : <br />
* As mentioned in limitations considering only skillset while assigning issues creates problem. So trazibot can be made to assign issue based on more number of factors, like time or calendar of the possible assignees. So this will require separate database table for trazibot to track deadlines of each assignee.
* Trazibot can be made to fetch user’s skills from its linkedin profile using LinkedIN api. This will make it efficient as it will not have to rely on webhook to get user details.
* Trazibot can also be integrated with task tracking tools/website like trello or JIRA to ease the software development process. .






