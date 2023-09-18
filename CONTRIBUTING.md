# Contributing

## Who can contribute ?

Everyone can contribute to this project. You'll have to use the fork method : 

    https://docs.github.com/en/get-started/quickstart/contributing-to-projects#about-forking

## How to launch the tests ?

To help maintain and improve this reporter, you just have to be able to launch the tests locally.

With Windows, use :

    npm run test:win

If you run on Linux, use

    npm run test

This command will build the reporter, then launch the tests and then use the expected_xray.json file to compare the result.

It's expected that some tests fail. The goal of these tests are to generate some good use cases to generate the xray.json

## How to edit the tests ?

To add/edit some tests, you'll have to edit the expected_xray.json file as well to match the expected behaviour. Some fields are not
expected with their exact values for the following reasons :

- Dates fields (like "start" and "finish") : The are fields with "{{DATE}}" in the expected file simply because we can't anticipate the real
  date in the final file
- "data" fields should contain "{{DATA}}" : base64 encoding are not the same between Windows and Linux, so it's complicated to make them
  both work on the same expected file
- "actualResult" should be trimmed off before "Duration:X" : Duration will not be the same each job. Plus, Linux env seems to have access to
  test code when it's skipped. Windows does not.

## Format

We lean on prettier to format our code :

- https://www.jetbrains.com/help/idea/prettier.html On Visual Code studio
- https://www.digitalocean.com/community/tutorials/how-to-format-code-with-prettier-in-visual-studio-code-fr

# Workflow

The development workflow is set on rebase-merge method. A branch must be rebased on the last version of main branch to be merged.

We use https://github.com/phips28/gh-action-bump-version to automatically version, package and publish each commit made on the main branch

- If your commit messages contains "pre-rc", it will automatically bump the version in the [x].[y].[z]-rc[0-X] format
- If your commit messages contains "feat" or "minor", it will automatically bump the version in the [x].[0-X].[z] format
- If your commit messages contains "major", it will automatically bump the version in the [0-X].[y].[z] format
- If none of the cases above, it will automatically bump the version in the [x].[y].[0-X] format
