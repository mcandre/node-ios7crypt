#!/usr/bin/env node

var
	http = require("http"),
	url = require("url"),
	_ = require("underscore"),
	sprintf = require("sprintf").sprintf,
	qc = require("quickcheck"),
	argv = require("optimist").argv;

//
// Until underscore adds zipWith
//

var slice = Array.prototype.slice;

function zipWith(f) {
	var args = _.zip.apply(null, slice.call(arguments, 1));
	return args.map(function (arg) { return f.apply(null, arg); });
}

exports.zipWith = zipWith;

var xlatPrime = [
	0x64, 0x73, 0x66, 0x64, 0x3b, 0x6b, 0x66, 0x6f,
	0x41, 0x2c, 0x2e, 0x69, 0x79, 0x65, 0x77, 0x72,
	0x6b, 0x6c, 0x64, 0x4a, 0x4b, 0x44, 0x48, 0x53,
	0x55, 0x42, 0x73, 0x67, 0x76, 0x63, 0x61, 0x36,
	0x39, 0x38, 0x33, 0x34, 0x6e, 0x63, 0x78, 0x76,
	0x39, 0x38, 0x37, 0x33, 0x32, 0x35, 0x34, 0x6b,
	0x3b, 0x66, 0x67, 0x38, 0x37
];

function xlat(index, len) {
	if (len < 1) {
		return [];
	}
	else {
		return [xlatPrime[index % xlatPrime.length]].concat(xlat(index + 1, len - 1));
	}
}

exports.xlat = xlat;

function encrypt(password) {
	var seed = Math.floor(Math.random() * 15);

	var plainBytes = password.split("").map(function (x) { return x.charCodeAt(0); });

	var keyBytes = xlat(seed, plainBytes.length);

	var cipherBytes = zipWith(function(a, b) { return a ^ b; }, plainBytes, keyBytes);

	return sprintf("%02d%s", seed, cipherBytes.map(function (h) { return sprintf("%02x", h); }).join(""));
}

exports.encrypt = encrypt;

function pairs(array) {
	if (array.length < 2) {
		return [];
	}
	else {
		return [array.slice(0, 2)].concat(pairs(array.slice(2, array.length)));
	}
}

exports.pairs = pairs;

// validBytes(array)
//
// Stops processing at the first NaN
//
// Only necessary due to the ECMA standard's
// retarded notion that NaN != NaN
//
function validBytes(array) {
	if (array.length < 1 || isNaN(array[0])) {
		return [];
	}
	else {
		return [array[0]].concat(validBytes(array.slice(1, array.length)));
	}
}

exports.validBytes = validBytes;

function decrypt(hash) {
	if (hash.length < 4) {
		return "";
	}
	else {
		var
			seed = hash.slice(0, 2),
			hash = hash.slice(2, hash.length);

		seed = parseInt(seed, 10);
		if (isNaN(seed) || seed < 0 || seed > 15) { return ""; }

		var ps = pairs(hash);

		var cipherBytes = ps.map(function (h) { return parseInt(h, 16); });

		cipherBytes = validBytes(cipherBytes);

		var keyBytes = xlat(seed, cipherBytes.length);

		var plainBytes = zipWith(function(a, b) { return a ^ b; }, cipherBytes, keyBytes);

		return plainBytes.map(function (x) { return String.fromCharCode(x); }).join("");
	}
}

exports.decrypt = decrypt;

function propReversible(password) {
	if (password.length > 1) {
		return decrypt(encrypt(password)) == password;
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

function page(req) {
	var query = url.parse(req.url, true).query;

	var
		password = query.encrypt,
		hash = query.decrypt;

	if (password != undefined) {
		return encrypt(password);
	}
	else if (hash != undefined) {
		return decrypt(hash);
	}
	else {
		return "no query";
	}
}

function server() {
	http.createServer(function (req, res) {
		res.writeHead(200);
		res.end(page(req));
	}).listen(8124, "localhost");

	console.log("Server running at http://localhost:8124/");
}

exports.server = server;

function usage() {
	console.log("ios7crypt.js [options]");
	console.log("-e <password>\tEncrypt");
	console.log("-d <hash>\tDecrypt");
	console.log("-t\t\tTest");
	console.log("-s\t\tServer");
	console.log("-h\t\tUsage");
}

exports.usage = usage;

function main() {
	if ("e" in argv) {
		console.log(encrypt(argv["e"]));
	}
	else if ("d" in argv) {
		console.log(decrypt(argv["d"]));
	}
	else if ("t" in argv) {
		test();
	}
	else if ("s" in argv) {
		server();
	}
	else {
		usage();
	}
}

if (!module.parent) { main(); }