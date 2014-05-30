#!/usr/bin/env node

var
http = require("http"),
url = require("url"),
path = require("path"),
querystring = require("querystring"),
fs = require("fs"),
mustache = require("mustache"),
ios7crypt = require("./ios7crypt");

var alternateFormats = [
  { extension: ".json", name: "JSON" },
  { extension: ".yml", name: "YAML" },
  { extension: ".xml", name: "XML" },
  { extension: ".ini", name: "INI" },
  { extension: ".txt", name: "TXT" }
];

var templates = {
  ".html": "ios7crypt.html.mustache",
  ".json": "ios7crypt.json.mustache",
  ".yml": "ios7crypt.yml.mustache",
  ".xml": "ios7crypt.xml.mustache",
  ".ini": "ios7crypt.ini.mustache",
  ".txt": "ios7crypt.txt.mustache"
};

for (var format in templates) {
  templates[format] = fs.readFileSync("views/" + templates[format]).toString();
}

var port = 8125;

var format2mimetype = {
  ".html": "text/html",
  ".json": "text/json",
  ".txt": "text/plain",
  ".yaml": "text/yaml",
  ".xml": "application/xml",
  ".ini": "application/octet-stream"
};

function server() {
  http.createServer(function (req, res) {
    var
    u = url.parse(req.url, true),
    query = u.query,
    format = path.extname(u.pathname) || ".html",
    password = query.password,
    hash = query.hash,
    myurl = "",
    mimetype = "";

    if (password !== undefined) {
      hash = ios7crypt.encrypt(password);
    }
    else if (hash !== undefined) {
      password = ios7crypt.decrypt(hash);
    }
    else {
      password = "";
      hash = "";
    }

    res.writeHead(200, {"Content-Type": format2mimetype[format]});

    var view = {
      query: querystring.stringify(query),
      alternateFormats: alternateFormats,
      password: password,
      hash: hash
    };

    var content = mustache.render(templates[format], view);
    res.end(content);
  }).listen(port);

  console.log("Server running at http://localhost:" + port + "/");
}

server();
