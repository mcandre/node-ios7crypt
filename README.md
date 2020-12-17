# ios7crypt - Encrypt and decrypt Cisco IOS7 passwords

# EXAMPLE

```
$ ios7crypt -e monkey
050609012a4957

$ ios7crypt -d "050609012a4957"
monkey
```

# DOCUMENTATION

https://mcandre.github.io/node-ios7crypt/

# NPM

https://www.npmjs.com/package/ios7crypt

# INSTALL

```
$ npm install [-g] ios7crypt
```

# REQUIREMENTS

* [Node.js](http://nodejs.org/) 14.15.1+

## Optional

* [Ruby](https://www.ruby-lang.org/) 2.7+
* [Bundler](http://bundler.io/)
* [Cucumber](http://cukes.info/)
* [Guard](http://guardgem.org/)
* [aspelllint](https://github.com/mcandre/aspelllint)
* [editorconfig-cli](https://github.com/amyboyd/editorconfig-cli) (e.g. `go get github.com/amyboyd/editorconfig-cli`)
* [flcl](https://github.com/mcandre/flcl) (e.g. `go get github.com/mcandre/flcl/...`)

# DEVELOPMENT

## Test

### Logic

Ensure the ios7crypt logic works as expected:

```console
$ npm test

> ios7crypt@0.0.10 test /Users/andrew/Desktop/src/node-ios7crypt
> mocha


  ․

  1 passing (36ms)
```

### CLI

Ensure the CLI works as expected:

```console
$ grunt cucumber
Feature: Run example tests

  Scenario: Running example tests            # features/run_example_tests.feature:3
    Given the program has finished           # features/step_definitions/steps.rb:1
    Then the output is correct for each test # features/step_definitions/steps.rb:5

1 scenario (1 passed)
2 steps (2 passed)
0m0.142s
```

## Lint

Keep the code tidy:

```console
$ grunt lint
```

## Document

```console
$ grunt doc
```

## Spell Check

```console
$ aspelllint
...
```
