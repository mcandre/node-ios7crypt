#!/usr/bin/env node
/*jslint nodejs:true */

var
	argv = require("optimist").string("e", "d").argv,
	qc = require("quickcheck"),
	ios7crypt = require("./ios7crypt");

function propReversible(password) {
	if (password.length > 1) {
		return ios7crypt.decrypt(ios7crypt.encrypt(password)) === password;
	}
	else {
		return true;
	}
}

exports.propReversible = propReversible;

function test() {
	return qc.forAll(propReversible, qc.arbString);
}

exports.test = test;

function usage() {
	console.log("cli.js [options]");
	console.log("-e <password>\tEncrypt");
	console.log("-d <hash>\tDecrypt");
	console.log("-t\t\tTest");
	console.log("-h\t\tUsage");
}

exports.usage = usage;

function main() {
	var
		password,
		hash;

	if ("e" in argv) {
		password = argv.e;

		if (password === undefined) {
			usage();
		}
		else {
			console.log(ios7crypt.encrypt(password));
		}
	}
	else if ("d" in argv) {
		hash = argv.d;

		if (hash === undefined) {
			usage();
		}
		else {
			console.log(ios7crypt.decrypt(hash));
		}
	}
	else if ("t" in argv) {
		test();
	}
	else {
		usage();
	}
}

if (!module.parent) { main(); }