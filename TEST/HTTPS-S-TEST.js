/*
  HTTPS serveri test

  Loob minimaalse HTTP või HTTPS serveri.
  HTTPS server kasutab võtit keys-TEST/https-server-TEST.key ja
  serti keys-TEST/https-server-TEST.cert.
   
   Käivitamine:
    node HTTPS-S-TEST <port> [SECURE]
*/

'use strict';
let http = require('http');
var https = require('https');
var fs = require('fs');
var path = require('path');

// Loe parameetrid
// Arvesta, et kaks esimest on nodejs ja skripti nimed
var kaivitamiseParameetrid = process.argv;
if (kaivitamiseParameetrid.length < 3) {
  console.log('HTTP(S) server: Liiga vähe parameetreid');
  kuvaKasutusteave();
  return
}
const PORT = parseInt(kaivitamiseParameetrid[2]);
if (kaivitamiseParameetrid.length >= 4 &&
  kaivitamiseParameetrid[3] == 'SECURE') {
  var secure = true;
}
else {
  var secure = false;
}

function kuvaKasutusteave() {
  console.log('node HTTPS-S-TEST <port> [SECURE]');
}

var keyPath = path.join(__dirname, 'keys-TEST',
  'https-server-TEST.key');
var certPath = path.join(__dirname, 'keys-TEST',
  'https-server-TEST.cert');
var options = {
  key: fs.readFileSync(keyPath, 'utf8'),
  cert: fs.readFileSync(certPath, 'utf8'),
  requestCert: false,
  rejectUnauthorized: false
};

if (secure) {
  /* HTTPS serveri loomine */
  https.createServer(options, (req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end('HTTPS server: OK');
  }).listen(PORT);
  console.log('HTTPS server kuulab pordil ' + PORT);
}
else {
  /* HTTP serveri loomine */
  http.createServer(function (req, res) {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end('HTTP server: OK');
  }).listen(PORT);
  console.log('HTTP server kuulab pordil ' + PORT);
}
