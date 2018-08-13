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
let buffered = ''; // Andmepuhver

function processReceived() {
  var received = buffered.split('\n');
  while (received.length > 1) {
    // Syslog kirje eraldatud
    console.log(received[0]);
    buffered = received.slice(1).join('\n');
    received = buffered.split('\n');
  }
}

// Defineeri TCP server
let server = net.createServer((socket) => {
  /* socket tüüp on Socket, vt
     https://nodejs.org/api/net.html
  */
  console.log('TARA-Stat: ühendusevõtt aadressilt ' + socket.remoteAddress + ':' + socket.remotePort);
  socket.write(`TARA-Stat kuuldel\r\n`);

  /* Socket on EventEmitter; sellest 'on' meetod.
    Andmete saabumise käsitlemine
  */
  socket.on('data', function (data) {
    console.log('TARA-Stat: saadud: ' + data.length + ' baiti');
    buffered += data;
    processReceived();
  });

  socket.on('close',
    () => {
      console.log('TARA-Stat: ühendus suletud');
    });

  socket.on('error',
    (errorMessage) => {
      console.log("TCP-Klient: viga käsitletud");
      console.log(errorMessage);
    });

});

// Käivita TCP server
server.listen(PORT);
console.log('TARA-Stat: kuuldel ' + 'pordil: ' + PORT);
