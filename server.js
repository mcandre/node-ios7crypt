#!/usr/bin/env node

var
http = require("http"),
url = require("url"),
ios7crypt = require("./ios7crypt");

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

  if (url !== "") {
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
    "</body></html>";

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
  }).listen(port);

  console.log("Server running at http://localhost:" + port + "/");
}

server();
