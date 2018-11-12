"use strict";

var
qc = require("quickcheck"),
assert = require("assert"),
ios7crypt = require("../lib/ios7crypt");

describe("ios7crypt", function() {
    describe("reversible", function() {
        it("should be reversible", function() {
            function propReversible(password) {
                if (password.length > 1) {
                    return ios7crypt.decrypt(ios7crypt.encrypt(password)) === password;
                }
                else {
                    return true;
                }
            }

            assert.equal(true, qc.forAll(propReversible, qc.arbString));
        });
    });
});
