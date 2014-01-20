var
ios7crypt = require("../ios7crypt"),
assert = require("assert");

describe("ios7crypt", function() {
  describe("reversible", function() {
    it("should be reversible", function() {
      assert.equal(true, ios7crypt.test());
    });
  });
});
