/*
  TCP-Server-test.js - Logikirje vastuvõtmise test 

  TCP server, võtab vastu Syslog vormingus logikirje
  
*/

'use strict';
const net = require('net');

let server = net.createServer((connection) => {
  console.log('TARA-Server võttis ühendust');
  connection.write(`TARA-Server kuuldel`);
      
  connection.on('data', function(data) {
    console.log('Saadud: ' + data);
    connection.write('Kätte saadud: ' + data);
  });
  
  connection.on('close',
    () => {
    console.log('Ühendus TCP kliendiga ' +
      connection.remoteAddress +
      connection.remotePort + ' suletud');
    });
   
 });

 server.listen(3000,
  () => console.log('TARA-Stat kuuldel'));