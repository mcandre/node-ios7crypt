#!/usr/bin/env node

var
http = require("http"),
url = require("url"),
fs = require("fs"),
mustache = require("mustache"),
ios7crypt = require("./ios7crypt");

var templates = {
  html: "ios7crypt.html.mustache",
  json: "ios7crypt.json.mustache",
  yaml: "ios7crypt.yml.mustache",
  xml: "ios7crypt.xml.mustache",
  ini: "ios7crypt.ini.mustache"
};

for (var format in templates) {
  templates[format] = fs.readFileSync("views/" + templates[format]).toString();
}

function formatHTML(view) {
  return mustache.render(templates["html"], view);
}

exports.formatHTML = formatHTML;

function formatJSON(view) {
  return mustache.render(templates["json"], view);
}

exports.formatJSON = formatJSON;

function formatYAML(view) {
  return mustache.render(templates["yaml"], view);
}

exports.formatYAML = formatYAML;

function formatXML(view) {
  return mustache.render(templates["xml"], view);
}

exports.formatXML = formatXML;

function formatINI(view) {
  return mustache.render(templates["ini"], view);
}

exports.formatINI = formatINI;

function formatTXT(password, hash) {
  return "Password:\t" + password + "\n" +
    "Hash:\t\t" + hash;
}

exports.formatTXT = formatTXT;

var port = 8125;

var format2mimetype = {
  html: "text/html",
  json: "text/json",
  txt: "text/plain",
  yaml: "text/yaml",
  xml: "application/xml",
  ini: "application/octet-stream"
};

function server() {
  http.createServer(function (req, res) {
    var
    query = url.parse(req.url, true).query,
    format = query.format || "html",
    password = query.password,
    hash = query.hash,
    myurl = "",
    mimetype = "";

    if (password !== undefined) {
      myurl += "?password=" + password;
      hash = ios7crypt.encrypt(password);
    }
    else if (hash !== undefined) {
      myurl += "?hash=" + hash;
      password = ios7crypt.decrypt(hash);
    }
    else {
      password = "";
      hash = "";
    }

    res.writeHead(200, {"Content-Type": format2mimetype[format]});

    var view = {
      url: myurl,
      password: password,
      hash: hash
    };

    var output = "";
    if (format === "html") {
      output = formatHTML(view);
    }
    else if (format === "json") {
      output = formatJSON(view);
    }
    else if (format === "yaml") {
      output = formatYAML(view);
    }
    else if (format === "xml") {
      output = formatXML(view);
    }
    else if (format === "ini") {
      output = formatINI(view);
    }
    else if (format === "txt") {
      output = formatTXT(password, hash);
    }

    res.end(output);
  }).listen(port);

  console.log("Server running at http://localhost:" + port + "/");
}

server();
