/*
  TCP-Klient-test.js - Logikirje saatja makett 

  Saadab Syslog vormingus logikirje, TCP kaudu
  
*/

'use strict';
const net = require('net');

// let HOST = 'tara-stat-makett.ci.kit';
let HOST = 'localhost';
let PORT = 5000;

let logikirjed = [
  'See on logikirje 1.\n',
  'See on logikirje 2.\n',
  'See on logikirje 3.\n',
];

let client = net.Socket();

client.connect(PORT, HOST, function() {
  console.log('TCP-Klient: TARA-Stat-ga ' + HOST + ':' + PORT + ' ühendus loodud');
  // Saada logikirjed
  logikirjed.forEach((logikirje) => { 
    console.log('TCP-Klient: saadetud: ' + logikirje);
    client.write(logikirje);
  });
  // Sule ühendus
  client.destroy();
  console.log('TCP-Klient: ühendus suletud');
});

client.on('data', function(data) {
	console.log('TCP-Klient: TARA-Stat-lt saadud: ' + data);
	// client.destroy(); // kill client after server's response
});

client.on('close', function() {
	console.log('TCP-Klient: TARA-Stat-ga ühendus suletud');
});

client.on('error', function(ex) {
  console.log("TCP-Klient: viga käsitletud");
  console.log(ex);
});