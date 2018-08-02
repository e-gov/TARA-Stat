/*
  TCP-Klient-test.js - Logikirje saatja makett 

  Saadab Syslog vormingus logikirje, TCP kaudu
  
*/

'use strict';
const net = require('net');

let logikirje = 'See on logikirje.';

let client = net.Socket();
client.connect(3000, '127.0.0.1', function() {
  console.log('TARA-Stat-ga ühendus loodud');
  console.log('Saadan: ' + logikirje);
  client.write(logikirje);
});

client.on('data', function(data) {
	console.log('Saadud TCP serverilt: ' + data);
	client.destroy(); // kill client after server's response
});

client.on('close', function() {
	console.log('TARA-Stat-ga ühendus suletud');
});