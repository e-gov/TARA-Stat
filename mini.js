/*
  TARA-Stat - Minimaalne test
*/

'use strict'; 
let http = require('http'); 
http.createServer(function (req, res) { 
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end('TARA-Stat - Minimaalne test OK'); 
}).listen(5001);