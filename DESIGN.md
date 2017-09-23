# Design Document

Team Members:
1. Shrikant Shete (sbshete)
2. Aayush Agarwal (asagarwa)
3. Sushant Gupta (sagupta)
4. Parag Nakhwa (psnakhwa)
5. Darshit Pandit (dupandit)

## Problem statement
## Bot Description
### Use Cases

```
Use Case 1: Recommend an assignee for a new github issue to a manager based on employee’s skill set.
1 Preconditions:
  Manager must have Slack and github tokens on the system.
2 Main Flow:
  A manager requests for a list of employees that can best solve a particular open issue. Bot will return a list of employees whose skill set match the ones required to solve that issue. Manager selects an employee, the bot assigns the issue to that employee.
3 Subflows:
[S1] Manager requests for a list of employees to solve an issue.
[S2] Bot returns a list of employees most appropriate to solve that issue. Manager selects an employee.
[S3] Bot assigns the issue to the selected employee.
4 Alternative Flows
[E1] Issue does not exist.
[E2] Issue already in closed state.
```
```
Use Case 2: Providing the manager with a list of major contributors for a buggy code.
1 Preconditions
  Manager must have Slack and github tokens on the system. Manager must know the filename where the buggy code lies.
2 Main Flow
  Manager provides the filename of the code where bug has been reported. Bot returns a list of employees who have made major commits to that file in recent times. Manager selects an employee, bot creates an issue for the same and assigns it to that employee.
3 Subflows
[S1] Manager provides filename of buggy code
[S2] Return list of major contributors of that code. Manager selects an employee.
[S3] An issue is created for the bug and assigned to the selected employee. 
4 Alternative Flows
[E1] No such file exists in the repository.
```
```
Use Case 3: Provide list of issues that are due to be solved in the next given number of days
1 Preconditions
  Manager must have Slack and github tokens on the system.
2 Main Flow
  Bot will return a list of issues and the assignees of the issues that are supposed to get closed within the specified number of days. Bot will ask the manager if he wants to notify any of the mentioned assignees.  
3 Subflows
[S1] Manager provides a number of days to find the issues that are due within those many days.
[S2] Bot returns a list of issues and the employees working on those issues.
[S3] If the manager chooses to notify any employee about the upcoming deadline, the bot notifies the employees about the same.
4 Alternative Flows
[E1] No issue due within the given time frame.
```
### Design Sketches
### Wireframe
This wireframe shows the interaction between Manager and BugBot in a Slack GUI. This interaction covers all 3 use cases mentioned above : </br>
<img src="/images/wireframe.PNG"/>


### Storyboard

**case 1: Recommend an assignee for a new github issue to a manager based on employee’s skill set**     
  
  
<img src="/images/Storyboard/case1.PNG"/>  
  
**case 2: Providing the Employee with a list of major contributors for a buggy code**   
  
<img src="/images/Storyboard/case2.PNG"/>  

**case 3: Provide list of issues that are due to be solved in the next given number of days**   
  <img src="/images/Storyboard/case3.PNG"/>

### Architecture Design
Architecture best represents a repository architecture pattern, in which the data for all the issues, every developer's’ past issue work and commit history are being pulled more often than pushed (like creating and assigning an issue) to Github. 

The users will use slack(Bot UI) as an interface to communicate with the bot, which will process the commands given by user and will get all the required data from github and provide user the output in a predefined format and may notify users based on the requirement. Node.js will be used as a backend with third-party libraries. 

<img src="/images/arch.jpg"/>

We will use Github REST api as an API gateway between bot and Github. Our project repository will be saved on the github. When bot receives a command, it (Node.js script) will call REST apis to request a required information (eg. people who can solve an issue, people who can be responsible for a bug, list of issues within deadline). As per the command bot will run an algorithm to find the right set of people to solve an issue (using issue heading, description, user's commit history, and labels) or an algorithm to find people who might be responsible for introducing or fixing a particular bug (may be using git blame and other ways). Through this bot will try to find a best possible matches.

AWS EC2 instance will have our bot deployed. This is the component where all the parsing, analysis and processing will be done. Bot will parse a command given by user to determine what action it is supposed to execute. These actions may involve pulling required data from github or pushing changes to modify issues (eg. add or change assignee, create an issue)


**Component Diagram**     
  
  
<img src="/images/component.PNG"/>  

### Additional Patterns
* We will require a mixture of patterns in order to make the BugBot work efficiently and accurately. 
* Two main patterns that we are going to use are Conversationists and Singleton Design pattern and these are the most used design patterns used for bit design. 
* As mentioned in [Conversationist pattern](http://willschenk.com/bot-design-patterns/#conversationists) we want to create this bugbot which will
React to messages : 
  -It will reply to messages which are tagged to him. (eg. message > @BugBot give me a list of employees.
  -Knows who they are talking to : BugBot will know who sent him the message and will tag on appropriate messages. (not all responses).
  -Can learn from what was said : For example, if bot has already notified the developer and the manager commands again then bot won’t do it.
* Second pattern that we are going to use is Singleton design pattern.  As we know Singleton: defines an instance operation that lets clients access its unique interface and clients access a Singleton instance solely through Singleton’s Instance operation.
* Obviously we cannot have > 1 instance of bot as we want to avoid race condition of multiple bots working on same command from the manager. So one client --> one interface --> one bot. Client here is not individual users, infact we can say client is “one channel with a group of managers”.

