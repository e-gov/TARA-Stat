/*
  TCP-klient-test.js - Logikirje saatja makett 

  Saadab Syslog vormingus logikirje, TCP kaudu
  
*/

'use strict';
const net = require('net');

let client = net.connect({ port: 3000 });

client.on('data', (data) => {
  console.log(data.toString());
});
