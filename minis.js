/*
  TARA-Stat - Minimaalne test
*/

'use strict'; 
let http = require('http'); 
var https = require('https');
var fs = require('fs');
var path = require('path');

var keyPath = path.join(__dirname, 'keys', 'tara-stat.key');
var certPath = path.join(__dirname, 'keys', 'tara-stat.cert');
var options = {
  key: fs.readFileSync(keyPath, 'utf8'),
  cert: fs.readFileSync(certPath, 'utf8'),
  requestCert: false,
  rejectUnauthorized: false
};

/*
http.createServer(function (req, res) { 
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.end('TARA-Stat - Minimaalne test OK'); 
}).listen(443);
*/

/* HTTPS serveri loomine */ 
https.createServer(options, (req, res) => {
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.end('TARA-Stat - Minimaalne test OK');
}).listen(5000);
