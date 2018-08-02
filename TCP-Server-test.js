/*
  TCP-server-test.js - Logikirje vastuvõtmise test 

  Võtab vastu Syslog vormingus logikirje, TCP kaudu
  
*/

'use strict';
const net = require('net');

let server = net.createServer((connection) => {
  console.log('TARA-Server võttis ühendust');
  connection.write(`TARA-Server võttis ühendust`);
      
  connection.on('close',
    () => {
    console.log('TARA-Server sulges ühenduse');
    });
   
 });

 server.listen(3000,
  () => console.log('TARA-Stat kuuldel'));