/*
  TCP-klient-test.js - Logikirje saatja makett 

  Saadab Syslog vormingus logikirje, TCP kaudu
  
*/

'use strict';
const net = require('net');

let client = net.Socket();
client.connect(3000, '127.0.0.1', function() {
  console.log('TARA-Stat-ga ühendus loodud');
  client.write('See on logikirje.');
});

client.on('data', function(data) {
	console.log('Saadud: ' + data);
	client.destroy(); // kill client after server's response
});

client.on('close', function() {
	console.log('TARA-Stat-ga ühendus suletud');
});