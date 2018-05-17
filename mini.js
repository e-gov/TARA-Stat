/*
  TARA-Stat - Minimaalne test
*/

'use strict';

var https = require('https');
var fs = require('fs');
var path = require('path');
const express = require('express');

/* Veebiserveri ettevalmistamine */
const app = express();
/* TODO: Eemaldada?
app.set('port', 5000); */

var keyPath = path.join(__dirname, 'keys', config.key);
var certPath = path.join(__dirname, 'keys', config.cert);
var options = {
  key: fs.readFileSync(keyPath, 'utf8'),
  cert: fs.readFileSync(certPath, 'utf8'),
  requestCert: false,
  rejectUnauthorized: false
};

/* HTTPS serveri loomine */
var port = 5000;
var server = https.createServer(options, app);

app.get('/', function (req, res) {
  res.send('OK');
});

/* HTTP puhul
app.listen(app.get('port'), function () {
 console.log('---- TARA-Stat käivitatud ----');
});
*/
server.listen(port, function () {
  console.log('--- TARA-Stat kuulab pordil: ' + server.address().port);
});
