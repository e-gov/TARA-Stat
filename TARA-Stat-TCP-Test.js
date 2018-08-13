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

function eraldaJSON(syslogKirje) {
  let osad = syslogKirje.split('{');
  if (osad.length > 1) {
    let msg = '{' + osad[1];
    console.log('TARA-Stat: Saadud: ' + msg);
  }
  else {
    console.log('TARA-Stat: Ei suuda Syslog kirjest JSON-t eraldada');
  }
}

// Defineeri TCP server
let server = net.createServer((socket) => {
  /* socket tüüp on Socket, vt
     https://nodejs.org/api/net.html
  */

  console.log('TARA-Stat: ühendusevõtt aadressilt ' + socket.remoteAddress + ':' + socket.remotePort);
  socket.write(`TARA-Stat kuuldel\r\n`);

  /* Andmete saabumise käsitleja
    'on' meetod on võimalik, kuna Socket on EventEmitter.
  */
  socket.on('data', function (data) {
    console.log('TARA-Stat: saadud: ' + data.length + ' baiti');
    /* Andmepuhver.
      Kui panna igale ühendusele eraldi, siis tekib probleem: 
      sündmuse 'data' käsitlejad võivad üksteisele sisse sõita.
      Probleemi ei teki, kui iga kirje tuleb ühes tükis (aga
      tükis võib olla mitu kirjet).
      Seetõttu on andmepuhver praegu pandud 'data'-käsitleja
      tasandile.
    */
    var buffered = '' + data;
    // console.log('TARA-Stat: buffered: ' + buffered);
    var received = buffered.split('\n');
    while (received.length > 1) {
      // Syslog kirje eraldatud
      let syslogKirje = received[0];
      buffered = received.slice(1).join('\n');
      received = buffered.split('\n');
      eraldaJSON(syslogKirje);
    }

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
