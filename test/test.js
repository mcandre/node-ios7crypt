'use strict';

const fc = require('fast-check'),
    ios7crypt = require('../lib/ios7crypt');

describe('ios7crypt', function() {
    describe('reversible', function() {
        it('should be reversible', function() {
            function propReversible(password) {
                return ios7crypt.decrypt(ios7crypt.encrypt(password)) === password;
            }

            fc.assert(fc.property(fc.string(), propReversible));
        });
    });
});
