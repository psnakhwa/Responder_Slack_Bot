## Use Case Refinement

Issue to be fixed:**Change the focus of the problem statement and the use cases** 

**Our Approach:** We met the faculty and discussed the idea again and it was decided that we focus our problem on a solid need "Finding People". Our entire team met for a brainstorming session and we finalized the new scenario to be the one solving problem to "finidng people" in all the organisations for various tasks like solving new issues, finding employees to understand code and also experienced people to review a code.  

We built each and every use case again around the problem statement carefully addressing the issues and jotting down the ways we could help solve this. After this, we decided on the API's, the data to use and the possible chat bot interactions.

Please find the 3 use cases at: [design.md]()

## Mocking of data 

For Trazi-bot, we will use the GitHub API. For this milestone, we have mocked the github data using JSON objects. We have created JSON file based on users of github and we are storing her/his details(login, issue number, repo url, etc) into it. This JSON consists of users names and collaborator lists. And we have mocked this data and used in our traziBot.js for read and write purpose. Here we have used array to store  users and related information. Please see [mock.json]() for clarity. We have imported this mocked JSON into traziBot.js file and bot eventually gives (in chat dispaly) the requested list of employee names and suggests a proper reviewer. 

Please refer to these files for Mocking code: [helper.js]()

## Bot implementation  

The Traži Bot would be a great solution for all the problems we mentioned above. It’s main aim would be to find appropriate assignees for various issues as well as code reviews and recommend them to the manager and thus reduce manager’s workload.

The bot will have the following workflows:

Manager asks for all issues → Bot provides a list → Manager provides a particular issue name → Bot uses text mining to extract the critical information from the issue name and maps it with commit history of all the developers to recommend the best possible assignee for that issue → Bot provides a list of best possible assignees to the manager. → Manager selects one name from that list → Bot assigns the issue to that developer and notifies him accordingly.

Developer provides a filename → Bot provides a list of employees who made modifications on that file in the past → Developer instructs the bot to notify those employees → Bot notifies the employees.

Developer provides a filename to the Bot and asks for potential reviewers → Bot provides a list of potential reviewers → Developer selects the reviewer which he/she wants → Bot notifies those reviewers.  

Please find the Bot Implementation code at [traziBot.js]()

## Selenium Testing

Please find selenium test script for each use case below : [Selenium_test]()

## Task Tracking

For task tracking we have used "Trello" cards. Please find worksheet at [Worksheet.md]()

## Screencast

Please find the screencast of the working bot [here]()
