## Use Case Refinement

Issue to be fixed:**Change the focus of the problem statement and the use cases** 

**Our Approach:** We met the faculty and discussed the idea again and it was decided that we focus our problem on a solid need "Finding People". Our entire team met for a brainstorming session and we finalized the new scenario to be the one solving problem to "finidng people" in all the organisations for various tasks like solving new issues, finding employees to understand code and also experienced people to review a code.  

We built each and every use case again around the problem statement carefully addressing the issues and jotting down the ways we could help solve this. After this, we decided on the API's, the data to use and the possible chat bot interactions.

Please find the 3 use cases at: [design.md](https://github.ncsu.edu/sbshete/CSC-510-Project/blob/master/DESIGN.md)

## Mocking of data 

For Trazi-bot, we will use the GitHub API. For this milestone, we have mocked the github data using JSON objects. We have created JSON file based on users of github and we are storing her/his details(login, issue number, repo url, etc) into it. This JSON consists of users names and collaborator lists. And we have mocked this data and used in our traziBot.js for read and write purpose. Here we have used array to store  users and related information. Please see [mock.json]() for clarity. We have imported this mocked JSON into traziBot.js file and bot eventually gives (in chat dispaly) the requested list of employee names and suggests a proper reviewer. 

Please refer to these files for Mocking code: [helper.js]()

## Database structure

<img width="704" alt="screen shot 2017-10-25 at 8 06 44 pm" src="https://media.github.ncsu.edu/user/6119/files/20c72e0e-b9c0-11e7-8b76-7446e7073b7c">

We plan to implement a database structure as shown above. Using MySQL we will create 2 tables, 1 describing the issue id, user id and the issue tags indicating what technology was a particular issue related to. Another table will contain the user id which will be its primary key and also various tags indicating the technologies a particular user is proficient with.

Once this database structure is implemented, we can convert requests on slack to appropriate database queries, efficiently mapping a new issue to an user based on his previous record of handling issues involving the same technology that of the current new issue. This database will be populated by a hooks file which will be triggered when any open issue is closed, thus adding that issue information and the user information to respective tables. This will ensure that every user has the tags he/she is comfortable working with and will also incorporate any new technology that a user has recently learned. 


## Bot implementation  

The Traži Bot would be a great solution for all the problems we mentioned above. It’s main aim would be to find appropriate assignees for various issues as well as code reviews and recommend them to the manager and thus reduce manager’s workload.

The bot will have the following workflows:

Manager asks for all issues → Bot provides a list → Manager provides a particular issue name → Bot uses text mining to extract the critical information from the issue name and maps it with commit history of all the developers to recommend the best possible assignee for that issue → Bot provides a list of best possible assignees to the manager. → Manager selects one name from that list → Bot assigns the issue to that developer and notifies him accordingly.

Developer provides a filename → Bot provides a list of employees who made modifications on that file in the past → Developer instructs the bot to notify those employees → Bot notifies the employees.

Developer provides a filename to the Bot and asks for potential reviewers → Bot provides a list of potential reviewers → Developer selects the reviewer which he/she wants → Bot notifies those reviewers.  

Please find the Bot Implementation code at [traziBot.js]()

## Selenium Testing

The initial code has been extensively tested using Selenium and Java. Each usecase has 1 testcase for happy path and alternative path. Happy path for example is where user wants to find an assignee for an issue and after requesting bot for the same, selects a recommendation provided by the bot and the bot assigns the issue to that user. Alternative path would be where user passes an user id which is not from the provided recommendations and bot warns about the same.

The testcases will ensure that any future changes in the code does not break anything and the basic functionality of the bot is maintained. All the 3 usecases work as expected at present.

Please find selenium test script for each use case below : [Selenium_test]()

## Task Tracking

For task tracking we have used "Trello" cards. Please find worksheet at [Worksheet.md]()

## Screencast

Please find the screencast of the working bot [here]()
