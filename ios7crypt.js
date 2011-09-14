#!/usr/bin/env node
/*jslint nodejs:true */

var
	http = require("http"),
	url = require("url"),
	zipwith = require("zipwith").zipwith,
	sprintf = require("sprintf").sprintf,
	qc = require("quickcheck"),
	argv = require("optimist").string("e", "d").argv,
	paperboy = require("paperboy"),
	path = require("path"),
	webroot = path.dirname(__filename);

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
	var
		seed = Math.floor(Math.random() * 15),
		plainBytes = password.split("").map(function (x) { return x.charCodeAt(0); }),
		keyBytes = xlat(seed, plainBytes.length),
		cipherBytes = zipwith(function(a, b) { return a ^ b; }, plainBytes, keyBytes);

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
	var
		seed,
		ps,
		cipherBytes,
		keyBytes,
		plainBytes;

	if (hash.length < 4) {
		return "";
	}
	else {
		seed = hash.slice(0, 2);

		hash = hash.slice(2, hash.length);

		seed = parseInt(seed, 10);
		if (isNaN(seed) || seed < 0 || seed > 15) { return ""; }

		ps = pairs(hash);
		cipherBytes = validBytes(ps.map(function (h) { return parseInt(h, 16); }));
		keyBytes = xlat(seed, cipherBytes.length);
		plainBytes = zipwith(function(a, b) { return a ^ b; }, cipherBytes, keyBytes);

		return plainBytes.map(function (x) { return String.fromCharCode(x); }).join("");
	}
}

exports.decrypt = decrypt;

function propReversible(password) {
	if (password.length > 1) {
		return decrypt(encrypt(password)) === password;
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
	var
		query = url.parse(req.url, true).query,
		password = query.password,
		hash = query.hash;

	if (password !== undefined) {
		hash = encrypt(password);
	}
	else if (hash !== undefined) {
		password = decrypt(hash);
	}
	else {
		password = "";
		hash = "";
	}

	return "<!DOCTYPE html>" +
		"<head>" +
		"<title>IOS7Crypt</title><meta http-equiv=\"Content-Type\" content=\"text/html;charset=utf-8\" />" +
		"<link rel=\"favorites icon\" href=\"/favicon.ico\" />" +
		"</head>" +
		"<body onload=\"document.getElementById('password').focus();\">" +
		"<style type=\"text/css\" />" +
		"body { text-align: center; }" +
		"a { color: #000; }" +
		"a:visited { color: #000; }" +
		"#logo { font-size: 500%; }" +
		"#crypto_form { display: block; margin: 5% auto; width: 300px; }" +
		"label { display: block; float: left; width: 5%; padding-right: 1%; }" +
		"#github { position: fixed; bottom: 1em; right: 1em; }" +
		"</style>" +
		"<h1 id=\"logo\"><a href=\"/\">IOS7Crypt</a></h1>" +
		"<div id=\"crypto_form\">" +

		"<form action=\"\" method=\"get\">" +
		"<p><label for=\"password\">Password</label> <input id=\"password\" type=\"text\" name=\"password\" value=\"" + password + "\" /></p>" +
		"</form>" +

		"<form action=\"\" method=\"get\">" +
		"<p><label for=\"hash\">Hash</label> <input id=\"hash\" type=\"text\" name=\"hash\" value=\"" + hash + "\" /></p>" +
		"</form>" +

		"</div>" +
		"<div id=\"github\"><a href=\"https://github.com/mcandre/node-ios7crypt\">GitHub</a></div>" +
		"</body></html";
}

function server() {
	http.createServer(function (req, res) {
		if (req.url === "/favicon.ico") {
			paperboy.deliver(webroot, req, res);
		}
		else {
			res.writeHead(200, {"Content-Type": "text/html"});
			res.end(page(req));
		}
	}).listen(8125, "localhost");

	console.log("Server running at http://localhost:8125/");
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
	var
		password,
		hash;

	if ("e" in argv) {
		password = argv.e;

		if (password === undefined) {
			usage();
		}
		else {
			console.log(encrypt(password));
		}
	}
	else if ("d" in argv) {
		hash = argv.d;

		if (hash === undefined) {
			usage();
		}
		else {
			console.log(decrypt(hash));
		}
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