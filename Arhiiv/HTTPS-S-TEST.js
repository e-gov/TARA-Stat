/*
  HTTPS serveri test

  Loob minimaalse HTTPS serveri.
   
  Käivitamine:
    node HTTPS-S-TEST <port>
*/

'use strict';

var https = require('https');
const fs = require('fs'); // Sertide laadimiseks
const path = require('path');

// Loe parameetrid
// Arvesta, et kaks esimest on nodejs ja skripti nimed
var kaivitamiseParameetrid = process.argv;
if (kaivitamiseParameetrid.length < 3) {
  console.log('HTTP(S) server: Liiga vähe parameetreid');
  kuvaKasutusteave();
  return
}
const PORT = parseInt(kaivitamiseParameetrid[2]);

function kuvaKasutusteave() {
  console.log('node HTTPS-S-TEST <port> [SECURE]');
}

var options = {
  ca: fs.readFileSync(
    path.join(__dirname, '..', '..', 'tara-ci-config',
     'TARA-Stat', 'keys', 'ca.cert'), 'utf8'),
  key: fs.readFileSync(
    path.join(__dirname, '..', '..', 'tara-ci-config',
     'TARA-Stat', 'keys', 'https-server.key'), 'utf8'),
  cert: fs.readFileSync(
    path.join(__dirname, '..', '..', 'tara-ci-config',
     'TARA-Stat', 'keys', 'https-server.cert'), 'utf8'),
  requestCert: false,
  rejectUnauthorized: false
};

/* HTTPS serveri loomine */
https.createServer(
  options,
  (req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end('HTTPS server: OK');
  }).listen(PORT);

console.log('HTTPS server kuulab pordil ' + PORT);
