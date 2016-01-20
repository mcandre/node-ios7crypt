"use strict";

require("es6-shim");
var
_ = require("underscore"),
sprintf = require("sprintf").sprintf,
path = require("path"),
qc = require("quickcheck");

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
  console.assert(Number.isInteger(index));
  console.assert(Number.isInteger(len));

  if (len < 1) {
    return [];
  }
  else {
    return [xlatPrime[index % xlatPrime.length]].concat(xlat(index + 1, len - 1));
  }
}

exports.xlat = xlat;

function xor(xs) {
  return _.reduce(xs, function(a, b) { return a ^ b; });
}

exports.xor = xor;

function encrypt(password) {
  console.assert(typeof password === "string");

  var
  seed = Math.floor(Math.random() * 15),
  plainBytes = password.split("").map(function (x) { return x.charCodeAt(0); }),
  keyBytes = xlat(seed, plainBytes.length),
  cipherBytes = _.zip(plainBytes, keyBytes).map(xor);

  return sprintf("%02d%s", seed, cipherBytes.map(function (h) { return sprintf("%02x", h); }).join(""));
}

exports.encrypt = encrypt;

function pairs(s) {
  console.assert(typeof s === "string");

  if (s.length < 2) {
    return [];
  }
  else {
    return [s.slice(0, 2)].concat(pairs(s.slice(2, s.length)));
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
  console.assert(_.each(array, function(e) { return Number.isInteger(e); }));

  if (array.length < 1 || isNaN(array[0])) {
    return [];
  }
  else {
    return [array[0]].concat(validBytes(array.slice(1, array.length)));
  }
}

exports.validBytes = validBytes;

function decrypt(hash) {
  console.assert(/[0-9]{2}[0-9a-fA-F]+/.test(hash));

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
    plainBytes = _.zip(cipherBytes, keyBytes).map(xor);

    return plainBytes.map(function (x) { return String.fromCharCode(x); }).join("");
  }
}

exports.decrypt = decrypt;
