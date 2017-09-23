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
Use Case 1: Create a meeting
1 Preconditions
   User must have google calendar api tokens in system.
2 Main Flow
   User will request meeting and provide list of attendees [S1].
   Bot will provide  possible meeting times and user confirms [S2].
   Bot creates meeting and posts link [S3].
3 Subflows
  [S1] User provides /meeting command with @username,@username list.
  [S2] Bot will return list of meeting times. User will confirm time.
  [S3] Bot will create meeting and post link to google calendar event.
4 Alternative Flows
  [E1] No team members are available.
  ```
```
Use Case 2: Assign a github issue to an employee based on availability.
1 Preconditions
   Employees must have google calendar api tokens in system.
2 Main Flow
   Manager will request a list employees whom he can assign an issue and provide a required time frame [S1].
   Bot will provide list of employees who are available during given the time frame and manager will select an employee to assign an issue [S2]. 
   Bot assigns an issue to the employee and notifies him [S3].
3 Subflows
  [S1] Manager provides /available command with start and end time.
  [S2] Bot will return list of Employees. Manager will decide whom to assign an issue. Manager provides /assign @username issue#
  [S3] Bot will assign an issue to employee, will notify him and add the task to his google calendar.
4 Alternative Flows
  [E1] No team members are available.
  ```

```
Use Case 3: Pairing an employee with a github issue based on skillset.
1 Preconditions
   System must have all employees' skillset. 
2 Main Flow
   Manager will request a list of open issues and bot will provide the same. [s1]
   Manager will request to find an employee  [S2]. Bot creates meeting and posts link [S3].
3 Subflows
  [S1] User provides /meeting command with @username,@username list.
  [S2] Bot will return list of meeting times. User will confirm time.
  [S3] Bot will create meeting and post link to google calendar event.
4 Alternative Flows
  [E1] No team members are available.
  ```

### Design Sketches
#### Wireframe
#### Storyboard

## Architecture Design
## Additional Patterns