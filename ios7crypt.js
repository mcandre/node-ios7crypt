#!/usr/bin/env node
/*jslint nodejs:true */

var
	zipwith = require("zipwith").zipwith,
	sprintf = require("sprintf").sprintf,
	path = require("path"),
	yamlish = require("yamlish"),
	data2xml = require("data2xml"),
	ini = require("ini");

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

<<<<<<< HEAD
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

function formatHTML(url, password, hash) {
	var html = "<!DOCTYPE html>" +
		"<head>" +
		"<title>IOS7Crypt</title><meta http-equiv=\"Content-Type\" content=\"text/html;charset=utf-8\" />" +
		"</head>" +
		"<body onload=\"document.getElementById('password').focus();\">" +
		"<style type=\"text/css\" />" +
		"body { text-align: center; }" +
		"a { color: #000; }" +
		"a:visited { color: #000; }" +
		"#logo { font-size: 500%; }" +
		"#crypto_form { display: block; margin: 5% auto; width: 300px; }" +
		"label { display: block; float: left; width: 5%; padding-right: 1%; }" +
		"#formats { position: fixed; bottom: 2em; left: 1em; }" +
		"#github { position: fixed; bottom: 2em; right: 1em; }" +
		"</style>" +
		"<h1 id=\"logo\"><a href=\"/\">IOS7Crypt</a></h1>" +
		"<div id=\"crypto_form\">" +

		"<form action=\"\" method=\"get\">" +
		"<p><label for=\"password\">Password</label> <input id=\"password\" type=\"text\" name=\"password\" value=\"" + password + "\" /></p>" +
		"</form>" +

		"<form action=\"\" method=\"get\">" +
		"<p><label for=\"hash\">Hash</label> <input id=\"hash\" type=\"text\" name=\"hash\" value=\"" + hash + "\" /></p>" +
		"</form>" +

		"</div>";

	if (url != "") {
		html += "<div id=\"formats\">Other formats: " +
			"<a href=\"" + ("/ios7crypt.json" + url) + "&format=json\">JSON</a>" +
			" " +
			"<a href=\"" + ("/ios7crypt.yaml" + url) + "&format=yaml\">YAML</a>" +
			" " +
			"<a href=\"" + ("/ios7crypt.xml" + url) + "&format=xml\">XML</a>" +
			" " +
			"<a href=\"" + ("/ios7crypt.ini" + url) + "&format=ini\">INI</a>" +
			" " +
			"<a href=\"" + ("/ios7crypt.txt" + url) + "&format=txt\">TXT</a>" +
			"</div>";
	}

	html += "<div id=\"github\"><a href=\"https://github.com/mcandre/node-ios7crypt\">GitHub</a></div>" +
		"</body></html";

	return html;
}

exports.formatHTML = formatHTML;

function formatJSON(password, hash) {
	return JSON.stringify({ password: password, hash: hash });
}

exports.formatJSON = formatJSON;

function formatYAML(password, hash) {
	return yamlish.encode({ password: password, hash: hash });
}

exports.formatYAML = formatYAML;

function formatXML(password, hash) {
	return data2xml("ios7crypt", { password: password, hash: hash });
}

exports.formatXML = formatXML;

function formatINI(password, hash) {
	return ini.encode({ password: password, hash: hash });
}

exports.formatINI = formatINI;

function formatTXT(password, hash) {
	return "Password:\t" + password + "\n" +
		"Hash:\t\t" + hash;
}

exports.formatTXT = formatTXT;

var port = 8125;

function server() {
	http.createServer(function (req, res) {
		var
			query = url.parse(req.url, true).query,
			format = query.format || "html",
			password = query.password,
			hash = query.hash,
			myurl = "";

		if (password !== undefined) {
			myurl += "?password=" + password;
			hash = encrypt(password);
		}
		else if (hash !== undefined) {
			myurl += "?hash=" + hash;
			password = decrypt(hash);
		}
		else {
			password = "";
			hash = "";
		}

		var mimetype = "";
		if (format == "html") {
			mimetype = "text/html";
		}
		else if (format == "json") {
			mimetype = "text/json";
		}
		else if (format == "yaml") {
			mimetype = "text/yaml";
		}
		else if (format == "xml") {
			mimetype = "application/xml";
		}
		else if (format == "ini") {
			mimetype = "application/octet-stream";
		}
		else if (format == "txt") {
			mimetype = "text/plain";
		}

		res.writeHead(200, {"Content-Type": mimetype});

		var output = "";
		if (format == "html") {
			output = formatHTML(myurl, password, hash);
		}
		else if (format == "json") {
			output = formatJSON(password, hash);
		}
		else if (format == "yaml") {
			output = formatYAML(password, hash);
		}
		else if (format == "xml") {
			output = formatXML(password, hash);
		}
		else if (format == "ini") {
			output = formatINI(password, hash);
		}
		else if (format == "txt") {
			output = formatTXT(password, hash);
		}

		res.end(output);
	}).listen(port, "localhost");

	console.log("Server running at http://localhost:" + port + "/");
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

		if (password === undefined || password == true) {
			usage();
		}
		else {
			console.log(encrypt(password));
		}
	}
	else if ("d" in argv) {
		hash = argv.d;

		if (hash === undefined || hash == true) {
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
