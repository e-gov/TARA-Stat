/*
  TCP-Server-test.js - Logikirje vastuvõtmise test 

  TCP server, võtab vastu Syslog vormingus logikirje
  
*/

'use strict';
const net = require('net');

let HOST = '127.0.0.1';
let PORT = 3000;

let server = net.createServer((connection) => {
  console.log('TARA-Server võttis ühendust');
  connection.write(`TARA-Server kuuldel\r\n`);
      
  connection.on('data', function(data) {
    console.log('TARA-Server-lt saadud: ' + data);
    connection.write('Kätte saadud: ' + data);
  });
  
  connection.on('close',
    () => {
    console.log('TARA-Server-ga ühendus suletud');
    });
   
 });

 server.listen(PORT, HOST);
 
 console.log('TARA-Stat kuuldel ' + HOST + ':' + PORT);