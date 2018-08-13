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

/* Alusta lukuhaldur
*/
var ReadWriteLock = require('rwlock');
var lock = new ReadWriteLock();

/**
 * Eraldab Syslog-kirje MSG-osast JSON-struktuuri.
 * Eeldab täpset vormingut.
 */
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

  /* Defineeri ühenduse töötleja
     Ühenduse (socket) tüüp on Socket, vt 
     https://nodejs.org/api/net.html
  */

  console.log('TARA-Stat: ühendusevõtt aadressilt ' + socket.remoteAddress + ':' + socket.remotePort);
  socket.write(`TARA-Stat kuuldel\r\n`);

  /* Andmepuhver.
    TCP on madalama taseme protokoll, mis tähendab, et logikirje võib tulla mitmes tükis. Ja ka vastupidi, ühes tükis võib tulla mitu logikirjet. TARA-Stat-is tehakse tüki saamisel lõim. Lõimel kulub tüki töötlemiseks natuke aega. Järgmine tükk võib aga juba sisse tulla, sellele tehakse uus lõim, mis alustab omakorda töötlust. Vaja on tagada, et esimene lõim lõpetab enne töö, kui järgmine alustab. S.t vaja on mutex-it (lukustamist). Javas on mutex-võimalus sisse ehitatud. Node.JS-s aga mitte.    
    Sündmuse 'data' käsitlejad võivad üksteisele sisse sõita.
    Probleemi ei teki, kui iga kirje tuleb ühes tükis (aga
    tükis võib olla mitu kirjet).
    Lukustamiseks on siin kasutatud teeki rwlock.
  */
  var buffered = '';

  /**
   * Analüüsib andmepuhvrit buffered, eraldab ja suunab
   * töötlusele kõik reavahetusega lõppevad osad.
   */
  function eraldaKirjedAndmepuhvrist() {
    var received = buffered.split('\n');
    while (received.length > 1) {
      // Syslog kirje eraldatud
      let syslogKirje = received[0];
      buffered = received.slice(1).join('\n');
      received = buffered.split('\n');
      eraldaJSON(syslogKirje);
    }
  }

  /* Andmete saabumise käsitleja
    'on' meetod on võimalik, kuna Socket on EventEmitter.
  */
  socket.on('data', function (data) {
    console.log('TARA-Stat: saadud: ' + data.length + ' baiti');
    // Võta andmepuhvrisse kirjutamise lukk
    lock.writeLock(function (release) {
      // Lisa saabunud andmed puhvrisse
      buffered += data;
      // Eemalda puhvrist täiskirjed
      eraldaKirjedAndmepuhvrist();
      // Vabasta lukk
      release();
    });

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
