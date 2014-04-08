# ios7crypt - Encrypt and decrypt Cisco IOS7 passwords

# INSTALL

    $ npm install -g ios7crypt

# EXAMPLE

    $ npm install
    $ grunt
    Running "exec:encrypt" (exec) task
    050609012a4957
    
    Running "exec:decrypt" (exec) task
    monkey
    
    Done, without errors.

# HOMEPAGE

http://ios7.yellosoft.us/

# REQUIREMENTS

* [Node.js](http://nodejs.org/) 0.10+

## Optional

* [Ruby](https://www.ruby-lang.org/) 2+
* [Bundler](http://bundler.io/)
* [Cucumber](http://cukes.info/)
* [Guard](http://guardgem.org/)
* [aspelllint](https://github.com/mcandre/aspelllint)

# DEVELOPMENT

## Test

### Logic

Ensure the ios7crypt logic works as expected:

    $ npm test

    > ios7crypt@0.0.10 test /Users/andrew/Desktop/src/node-ios7crypt
    > mocha


      ․

      1 passing (36ms)

### CLI

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

## Lint

Keep the code tidy:

    $ npm run-script lint

## Spell Check

    $ aspelllint
    ...

## Local CI

Guard can automatically check for compliance on file change:

    $ bundle
    $ guard -G Guardfile-test
    $ guard -G Guardfile-cucumber
    $ guard -G Guardfile-lint
