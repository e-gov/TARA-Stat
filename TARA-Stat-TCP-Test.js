/*
  TARA-Stat-TCP-Test.js - Logikirje vastuvõtmise test 

  Testrakendus, mille eesmärk on testida logikirje saatmist
  TARA-Stat-le Syslog vormingus, TCP kaudu

  Testrakendus kuulab TCP pordil 5000 ja väljastab vastuvõetud
  logikirjed konsoolile.

  Testrakenduse käivitamine:
  - cd /opt/TARA-Stat
  - node TARA-Stat-TCP-Test.js
  
*/

'use strict';
const net = require('net');

let PORT = 5000;

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

 server.listen(PORT);
 
 console.log('TARA-Stat kuuldel ' + HOST + ':' + PORT);