#!/usr/bin/env node

var
argv = require("optimist").string("e", "d", "t", "h", "v").argv,
qc = require("quickcheck"),
pkginfo = require("pkginfo")(module, "version"),
ios7crypt = require("./ios7crypt");

function usage() {
  console.log("cli.js [options]");
  console.log("-e <password>\tEncrypt");
  console.log("-d <hash>\tDecrypt");
  console.log("-t\t\tTest");
  console.log("-h\t\tUsage");
  console.log("-v\t\tVersion info");
}

exports.usage = usage;

function main() {
  var
  password,
  hash;

  if ("e" in argv) {
    password = argv.e;

    if (password === undefined || password === true) {
      usage();
    }
    else {
      console.log(ios7crypt.encrypt(password));
    }
  }
  else if ("d" in argv) {
    hash = argv.d;

    if (hash === undefined || hash === true) {
      usage();
    }
    else {
      console.log(ios7crypt.decrypt(hash));
    }
  }
  else if ("t" in argv) {
    ios7crypt.test();
  }
  else if ("v" in argv) {
    console.log(module.exports.version);
  }
  else {
    usage();
  }
}

if (!module.parent) { main(); }
