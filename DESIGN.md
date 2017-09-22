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
### Design Sketches
### Wireframe
This wireframe shows the interaction between Manager and BugBot in a Slack GUI. This interaction covers all 3 use cases mentioned above : </br>
<img src="/images/wireframe.PNG"/>


### Storyboard
### Architecture Design
### Additional Patterns
