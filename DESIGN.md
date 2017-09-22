# Design Document

Team Members:
1. Shrikant Shete (sbshete)
2. Aayush Agarwal (asagarwa)
3. Sushant Gupta (sagupta)
4. Parag Nakhwa (psnakhwa)
5. Darshit Pandit (dupandit)

## Problem statement
## Bot Dscription
### Use Cases

```
Use Case: Recommend an assignee for a new github issue to a manager based on employee’s skill set.
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
Use Case: Providing the manager with a list of major contributors for a buggy code.
1 Preconditions
  Manager must have Slack and github tokens on the system. Manager must know the filename where the buggy code lies.
2 Main Flow
  Manager provides the filename of the code where bug has been reported. Bot returns a list of employees who have made major commits to that file in recent times. Manager selects an employee, bot creates an issue for the same and assigns it to that employee.
3 Subflows
 [S1] Manager provides filename of buggy code
 [S2] Return list of major contributors of that code.  Manager selects an     employee.
[S3] An issue is created for the bug and assigned to the selected employee. 
4 Alternative Flows
[E1] No such file exists in the repository.
```
```
Use Case: Provide list of issues that are due to be solved in the next given number of days
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
### Architecture Design
### Additional Patterns
##### Adapter Pattern
Adapter can simply be defined as a bridge that connects 2 interface which are otherwise incompatible. In this scenario we can consider the bot as an adapter as it is helping to execute commands which the user inputs on slack interface and executes those commands on the target Github interface.
