/*
  TLS server (TEST). Server kuulab TCP pordil ja väljastab
  vastuvõetud logikirjed konsoolile. Töötab, vastavalt seadistusele,
  nii Windows kui ka Linux platvormil. Usaldus serveri ja kliendi vahel
  luuakse, vastavalt seadistusele, kas CA või isetehtud sertide abil. 
  Võtmete ja sertide ettevalmistamiseks kasuta skripti 
  Gen-krypto-TEST.sh. Vt ka: TLS klient (TEST).

  Käivitamine: node TLS-S-TEST <op-süsteem> <serditüüp> <port>,
  kus
    <opsüsteem> - Windows | Linux
    <serditüüp> - CA | Self
    <port> - pordinumber
  
*/

'use strict';
const tls = require('tls'); // TCP ühenduste teek (TLS-ga)
const fs = require('fs'); // Sertide laadimiseks
const path = require('path');

// Alusta lukuhaldur
var ReadWriteLock = require('rwlock');
var lock = new ReadWriteLock();

// Loe ja kontrolli käivitamisel antud parameetrid
// Vt: https://nodejs.org/docs/latest/api/process.html#process_process_argv
const kaivitamiseParameetrid = process.argv;
if (kaivitamiseParameetrid.length < 5) {
  console.log('TLS server: Liiga vähe parameetreid');
  kuvaKasutusteave();
  return
}
const opsys = kaivitamiseParameetrid[2];
if (!['Linux', 'Windows'].includes(opsys)) {
  console.log('TLS server: Op-süsteem p.o Linux v Windows');
  kuvaKasutusteave();
  return
}
const sertType = kaivitamiseParameetrid[3];
if (!['CA', 'Self'].includes(sertType)) {
  console.log('TLS server: Serditüüp p.o CA v Self');
  kuvaKasutusteave();
  return
}
const PORT = parseInt(kaivitamiseParameetrid[4]);

function kuvaKasutusteave() {
  console.log('node TLS-S-TEST <op-süsteem> <serditüüp>');
  console.log('<opsüsteem> - Windows | Linux');
  console.log('<serditüüp> - CA | Self');
}

/**
 * Eraldab Syslog-kirje MSG-osast JSON-struktuuri.
 * Eeldab täpset vormingut.
 */
function eraldaJSON(syslogKirje) {
  let osad = syslogKirje.split('{');
  if (osad.length > 1) {
    let msg = '{' + osad[1];
    console.log('TLS Server: Saadud: ' + msg);
  }
  else {
    console.log('TLS Server: Ei suuda Syslog kirjest JSON-t eraldada');
  }
}

// TLS serveri seadistus 
// Serdid ja võtmed
if (sertType == 'CA') {
  var TLS_S_options = {
    key: fs.readFileSync(
      path.join(__dirname, '..', '..', 'tara-ci-config', 'TARA-Stat', 'keys-TEST',
        'tls-server-TEST.key'), 'utf8'),
    cert: fs.readFileSync(
      path.join(__dirname, '..', '..', 'tara-ci-config', 'TARA-Stat', 'keys-TEST',
        'tls-server-TEST.cert'), 'utf8'),
    ca: fs.readFileSync(
      path.join(__dirname, '..', '..', 'tara-ci-config', 'TARA-Stat', 'keys-TEST',
        'ca-TEST.cert'), 'utf8'),
    requestCert: false,
    rejectUnauthorized: false
  };
}
else { // Serditüübi Self korral
  var TLS_S_options = {
    key: fs.readFileSync(
      path.join(__dirname, '..', '..', 'tara-ci-config', 'TARA-Stat', 'keys-TEST',
        'tls-server-SELF-TEST.key'), 'utf8'),
    cert: fs.readFileSync(
      path.join(__dirname, '..', '..', 'tara-ci-config', 'TARA-Stat', 'keys-TEST',
        'tls-server-SELF-TEST.cert'), 'utf8'),
    ca: fs.readFileSync(
      path.join(__dirname, '..', '..', 'tara-ci-config', 'TARA-Stat', 'keys-TEST',
        'tls-client-SELF-TEST.cert'), 'utf8'),
    requestCert: false,
    rejectUnauthorized: false
  };
}

// Defineeri TLS server
let server = tls.createServer(
  TLS_S_options,
  // Defineeri ühenduse töötleja
  // Ühenduse (socket) tüüp on Socket, vt 
  // https://nodejs.org/api/net.html
  (socket) => {
    console.log('TLS Server: ühendusevõtt aadressilt ' + socket.remoteAddress + ':' + socket.remotePort);
    let kliendisert = socket.getPeerCertificate();
    console.log('TLS Server: klient esitas serdi:');
    console.log(JSON.stringify(
      kliendisert,
      ['subject', 'issuer', 'C', 'O', 'CN', 'valid_from', 'valid_to'],
      ' '));

    // Kas kliendi autoriseerimine õnnestus?
    if (socket.authorized) {
      console.log("TLS Server: autoriseerisin ühenduse.");
    }
    else {
      console.log("TLS Server: ei autoriseerinud ühendust " +
        socket.authorizationError)
    }

    socket.write(`TLS Server kuuldel\r\n`);

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
      console.log('TLS Server: saadud: ' + data.length + ' baiti');
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
        console.log('TLS Server: ühendus suletud');
      });

    socket.on('error',
      (errorMessage) => {
        console.log("TLS Server: viga käsitletud");
        console.log(errorMessage);
      });

  });

// Käivita TCP server
server.listen(PORT);
console.log('TLS Server: kuuldel ' + server.address() + ':' + PORT);
