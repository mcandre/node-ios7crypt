'use strict';

/**
 * @mainpage
 *
 * @ref encrypt generates hashes.
 *
 * @ref decrypt reverses hashes.
 */

var _ = require('underscore'),
    sprintf = require('sprintf').sprintf;

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
    } else {
        return [xlatPrime[index % xlatPrime.length]].concat(xlat(index + 1, len - 1));
    }
}

function xor(xs) {
    return _.reduce(xs, function(a, b) { return a ^ b; });
}

/**
 * encrypt hashes passwords according to legacy Cisco IOSv7 behavior.
 *
 * @param password {string} plaintext
 *
 * @returns hash
 */
function encrypt(password) {
    var seed = Math.floor(Math.random() * 15),
        plainBytes = password
            .split('')
            .map(function(x) { return x.charCodeAt(0); }),
        keyBytes = xlat(seed, plainBytes.length),
        cipherBytes = _.zip(plainBytes, keyBytes).map(xor);

    return sprintf(
        '%02d%s',
        seed,
        cipherBytes
            .map(function(h) { return sprintf('%02x', h); })
            .join('')
    );
}

exports.encrypt = encrypt;

function pairs(s) {
    if (s.length < 2) {
        return [];
    } else {
        return [s.slice(0, 2)].concat(pairs(s.slice(2, s.length)));
    }
}

// Stops processing at the first NaN
function validBytes(bytes) {
    if (bytes.length < 1 || isNaN(bytes[0])) {
        return [];
    } else {
        return [bytes[0]].concat(validBytes(bytes.slice(1, bytes.length)));
    }
}

/**
 * decrypt reverses hashes.
 *
 * @param {string} hash Cisco IOSv7 legacy algorithm
 *
 * @returns plaintext
 */
function decrypt(hash) {
    var seed,
        ps,
        cipherBytes,
        keyBytes,
        plainBytes;

    if (hash.length < 4) {
        return '';
    } else {
        seed = hash.slice(0, 2);

        hash = hash.slice(2, hash.length);

        seed = parseInt(seed, 10);
        if (isNaN(seed) || seed < 0 || seed > 15) { return ''; }

        ps = pairs(hash);
        cipherBytes = validBytes(ps.map(function(h) { return parseInt(h, 16); }));
        keyBytes = xlat(seed, cipherBytes.length);
        plainBytes = _.zip(cipherBytes, keyBytes).map(xor);

        return plainBytes
            .map(function(x) { return String.fromCharCode(x); })
            .join('');
    }
}

exports.decrypt = decrypt;
