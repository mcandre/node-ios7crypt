#!/usr/bin/env node

var
http = require("http"),
url = require("url"),
fs = require("fs"),
mustache = require("mustache"),
ios7crypt = require("./ios7crypt");

var indexTemplate = fs.readFileSync("index.mst").toString();

function formatHTML(view) {
  var html = mustache.render(indexTemplate, view);

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
      output = formatJSON(password, hash);
    }
    else if (format === "yaml") {
      output = formatYAML(password, hash);
    }
    else if (format === "xml") {
      output = formatXML(password, hash);
    }
    else if (format === "ini") {
      output = formatINI(password, hash);
    }
    else if (format === "txt") {
      output = formatTXT(password, hash);
    }

    res.end(output);
  }).listen(port);

  console.log("Server running at http://localhost:" + port + "/");
}

server();
