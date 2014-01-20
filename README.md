# ios7crypt - Encrypt and decrypt Cisco IOS7 passwords

# EXAMPLE

    $ npm install
    $ make test
    node cli.js -e monkey
    00091c080f5e12
    node cli.js -d 00091c080f5e12
    monkey

# HOMEPAGE

http://ios7.yellosoft.us/

# REQUIREMENTS

* [Node.js](http://nodejs.org/) 0.10+

## Optional

* [Ruby](https://www.ruby-lang.org/) 2+
* [Bundler](http://bundler.io/)
* [Cucumber](http://cukes.info/)
* [Guard](http://guardgem.org/)

# TESTING

## Logic

Ensure the ios7crypt logic works as expected:

    $ npm test

    > ios7crypt@0.0.10 test /Users/andrew/Desktop/src/node-ios7crypt
    > mocha


      +++ OK, passed 100 tests.
    ․

      1 passing (37ms)

## CLI

Ensure the CLI works as expected:

    $ bundle
    $ cucumber
    Feature: Run example tests

      Scenario: Running example tests            # features/run_example_tests.feature:3
        Given the program has finished           # features/step_definitions/steps.rb:1
        Then the output is correct for each test # features/step_definitions/steps.rb:5

    1 scenario (1 passed)
    2 steps (2 passed)
    0m0.142s

Guard can automatically run testing when the code changes:

    $ bundle
    $ guard -G Guardfile-cucumber
    ...

# INSTALL

    $ npm install ios7crypt

# LINT

Keep the code tidy:

    $ npm run-script lint

Guard can automatically lint when the code changes:

    $ bundle
    $ guard -G Guardfile-lint
    ...
