# ios7crypt - Encrypt and decrypt Cisco IOS7 passwords

# HOMEPAGE

[http://ios7.yellosoft.us/](http://ios7.yellosoft.us/)

# REQUIREMENTS

  - [Node.js](http://nodejs.org/)
  - [Paperboy](http://search.npmjs.org/#/paperboy)
  - [zipwith](http://search.npmjs.org/#/zipwith)
  - [Sprintf](http://search.npmjs.org/#/sprintf)
  - [Quickcheck](http://search.npmjs.org/#/quickcheck)
  - [Optimist](http://search.npmjs.org/#/optimist)

# DEVELOPMENT

# Linting

Keep the code tidy:

    $ npm run-script lint

# EXAMPLE

    $ git clone https://github.com/mcandre/node-ios7crypt.git
    $ npm install
    $ ./cli.js -e monkey
    00091c080f5e12
    $ ./cli.js -d 00091c080f5e12
    monkey
