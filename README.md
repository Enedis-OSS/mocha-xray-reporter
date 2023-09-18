# mocha-xray-reporter

This project allow to generate a Xray file based on references in tests titles. The file is automatically generated as the tests run.
Generated Xray file can then be uploaded in Jira to create or update a Test Exec report with or without proofs.

You will find generic information in this document. For more specific information, read the following ones:

- [GETTING_STARTED.md](https://github.com/Enedis-OSS/mocha-xray-reporter/blob/main/GETTING_STARTED.md) : to be able to install and use this reporter
- [CONTRIBUTING.md](https://github.com/Enedis-OSS/mocha-xray-reporter/blob/main/CONTRIBUTING.md) : if you want to contribute to this project
- [LICENSE](https://github.com/Enedis-OSS/mocha-xray-reporter/blob/main/LICENSE) : to display the license we use

## How does it work

The main mechanism is to maintain some references towards tests tickets and steps (in Jira, with the Xray plugin). By using and configuring
a mocha reporter, these references will be detected and written in a xray compatible format when the tests are launched and written with
Mocha. If you use Cypress (which is Mocha-based) or any other screenshots-taker tool, you can reference the folder where they are saved. It
will be parsed to use screenshots as proofs in Jira tickets

After that, it's up to you to upload the file manually or to deploy it automatically in your CI

## Shift Left Testing

This reporter has been made to promote Shift left testing (https://en.wikipedia.org/wiki/Shift-left_testing). The goal was to create a link
between tests made by developers and tests written by acceptance tests teams by :

- allowing acceptance tests from developers to be visible by functional teams
- adding value to the test tickets from acceptance teams and automate them inside the dev workflow

Whereas it can work only with Mocha and then allowing to generate report from Unit Tests, it has been made to work in acceptance tests
level. Tests' results will have more impact if their scope is a functionality instead of a code function and if they carry proofs.

## Philisophy

Some projects allow to generate tests code directly from Xray tickets and steps through mechanisms like Cucumber/Gherkin. The main downsides
are :

- you have to test on a specific environment, which can be cumbersome to maintain with data and external applications (API, Authentication
  provider)
- your tests are separated from your code (code that is often in a different repository)
- you have to maintain a dictionary so that acceptance team can write elevated code
- your test workflow come after your code workflow (generally after everything has been merged)

--> This approach can be seen as "functional" oriented and ignore the development process

Some other projects allow to generate Xray Tests from a test result of your code. The main downsides are :

- You can generate a bunch of Test tickets in one go but can't control how much (mainly everything or nothing)
- You generate one ticket for each test, with no steps, which can end with a lot of ticket
- The id for the ticket is the name, so if you change the name, you end up creation another ticket and the old one stay there, not updated
  anymore
- it doesn't take in account the screenshots, description or what the code contains, which limit the context of the test

--> This approach can be seen as "developer" oriented and ignore the acceptance test team process

With this reporter :

- functional/acceptance tests team
  - can still control the tickets and steps they use for their manual acceptance tests with every detail
  - profit when some are automated with a brand new already filled report (with proofs !)
  - have more faith in the fact that the dev team didn't break any functional rule
- developers team
  - can automate ticket by ticket what they can when they can
  - keep the same technology to code their tests (no new language to apprehend)
  - have a failed test when they break some functional rule
  - make their work visible

## Cypress

This reporter was originally made to work with Cypress (https://www.cypress.io/), but it's not linked to it. If your application has a User
Interface, it is highly recommended though to use this reporter in concordance with Cypress or another tool capable of :

- test your application, by interacting with the interface
- mocking requests
- generating screenshots
