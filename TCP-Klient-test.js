/*
  TCP-Klient-test.js - Logikirje saatja makett 

  Saadab Syslog vormingus logikirje, TCP kaudu
  
*/

'use strict';
const net = require('net');

let HOST = '127.0.0.1';
let PORT = 3000;

let logikirje = 'See on logikirje.\r\n';

let client = net.Socket();
client.connect(PORT, HOST, function() {
  console.log('TARA-Stat-ga ' + HOST + ':' + PORT + ' ühendus loodud');
  console.log('TARA-Stat-le saadetud: ' + logikirje);
  client.write(logikirje);
});

client.on('data', function(data) {
	console.log('TARA-Stat-lt saadud: ' + data);
	client.destroy(); // kill client after server's response
});

client.on('close', function() {
	console.log('TARA-Stat-ga ühendus suletud');
});