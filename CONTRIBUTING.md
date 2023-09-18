# Contributing

## Who can contribute ?

Everyone can contribute to this project. You'll have to use the fork method : 

    https://docs.github.com/en/get-started/quickstart/contributing-to-projects#about-forking

## How to launch the tests ?

To help maintain and improve this reporter, you just have to be able to launch the tests locally.

    npm test

Jest is used to launch tests. The tests must be coded in the "test" folder and use the method "launchMochaAndReturnResult"
to dynamically load a typical mocha test file in "test/resources". Then it can assert the result and validate/invalidate the test

## Format

We lean on prettier to format our code :

- https://www.jetbrains.com/help/idea/prettier.html

On Visual Code studio

- https://www.digitalocean.com/community/tutorials/how-to-format-code-with-prettier-in-visual-studio-code-fr

# Workflow

The development workflow is set on rebase-merge method. A branch must be rebased on the last version of main branch to be merged.

We use https://github.com/phips28/gh-action-bump-version to automatically version, package and publish each commit made on the main branch

- If your commit messages contains "pre-rc", it will automatically bump the version in the [x].[y].[z]-rc[0-X] format
- If your commit messages contains "feat" or "minor", it will automatically bump the version in the [x].[0-X].[z] format
- If your commit messages contains "major", it will automatically bump the version in the [0-X].[y].[z] format
- If none of the cases above, it will automatically bump the version in the [x].[y].[0-X] format
