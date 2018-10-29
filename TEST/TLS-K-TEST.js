/*
  TLS klient (TEST).
  
  TLS klient ühendub TLS serveriga (TEST) ja saadab mõned logikirjed.
  Töötab, vastavalt seadistusele, nii Windows kui ka Linux platvormil.
  
  Võtmete ja serdid (krüptomaterjal) peavad olema ette valmistatud kaustas:
    ../../tara-ci-config/TARA-Stat/keys-TEST
   
  Vt ka: TLS server (TEST).

  Käivitamine: node TLS-K-TEST <op-süsteem> <serditüüp> <sd> <port>,
  kus
    <opsüsteem> - Windows | Linux
    <serditüüp> - CA | Self
    <sd> - serveri domeeninimi
    <port> - serveri port
  
  Enne käivita TLS-S-TEST.

*/

'use strict';
const tls = require('tls');
const fs = require('fs');
const path = require('path');

// Loe käivitamisel antud parameetrid
// Vt: https://nodejs.org/docs/latest/api/process.html#process_process_argv
const kaivitamiseParameetrid = process.argv;
if (kaivitamiseParameetrid.length < 6) {
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
const TLS_SERVER_HOST = kaivitamiseParameetrid[4];
const TLS_SERVER_PORT = kaivitamiseParameetrid[5];

function kuvaKasutusteave() {
  console.log('Kasuta nii: node TLS-K-TEST <op-süsteem> <serditüüp> <sd> <port>');
  console.log('<opsüsteem> - Windows | Linux');
  console.log('<serditüüp> - CA | Self');
  console.log('<sd> - serveri domeeninimi');
  console.log('<port> - serveri port');
}

// Test-logikirjed. Kirje lõpus on \n (0x0A)
let logikirjed = [
  '<38>Aug  1 10:51:54 acf2e2b322ab {"time":"2018-10-01T10:51:54.542","clientId":"openIdDemo","method":"mID","operation":"START_AUTH"}\n',
  '<38>Aug  1 10:52:05 acf2e2b322ab {"time":"2018-10-01T10:52:05.252","clientId":"openIdDemo","method":"mID","operation":"SUCCESSFUL_AUTH"}\n',
  '<38>Aug  1 10:53:54 acf2e2b322ab {"time":"2018-10-01T10:53:54.261","clientId":"openIdDemo","method":"mID","operation":"ERROR","error":"NO_AGREEMENT: User is not a Mobile-ID client"}\n',
];

// Valmista ette kliendi suvandid
var TLS_C_OPTIONS = {
  host: TLS_SERVER_HOST,
  port: TLS_SERVER_PORT,
  requestCert: false,
  rejectUnauthorized: false
}

if (sertType == 'CA') {
  TLS_C_OPTIONS.ca = fs.readFileSync(
    path.join(__dirname, '..', '..', 'tara-ci-config', 'TARA-Stat', 'keys-TEST',
      'ca-TEST.cert'), 'utf8');
  TLS_C_OPTIONS.key = fs.readFileSync(
    path.join(__dirname, '..', '..', 'tara-ci-config', 'TARA-Stat', 'keys-TEST',
      'tls-client-TEST.key'), 'utf8');
  TLS_C_OPTIONS.cert = fs.readFileSync(
    path.join(__dirname, '..', '..', 'tara-ci-config', 'TARA-Stat', 'keys-TEST',
      'tls-client-TEST.cert'), 'utf8');
}
else {
  TLS_C_OPTIONS.ca = fs.readFileSync(
    path.join(__dirname, '..', '..', 'tara-ci-config', 'TARA-Stat', 'keys-TEST',
      'tls-server-SELF-TEST.cert'), 'utf8');
  TLS_C_OPTIONS.key = fs.readFileSync(
    path.join(__dirname, '..', '..', 'tara-ci-config', 'TARA-Stat', 'keys-TEST',
      'tls-client-SELF-TEST.key'), 'utf8');
  TLS_C_OPTIONS.cert = fs.readFileSync(
    path.join(__dirname, '..', '..', 'tara-ci-config', 'TARA-Stat', 'keys-TEST',
      'tls-client-SELF-TEST.cert'), 'utf8');
}

// Loo TLS klient, ühendu TLS serveriga
const socket = tls.connect(TLS_C_OPTIONS, () => {
  console.log('TLS klient: TARA-Stat-ga ' +
    TLS_SERVER_HOST + ':' + TLS_SERVER_PORT +
    ' ühendus loodud');

    // Kas kliendi autoriseerimine õnnestus?
  if (socket.authorized) {
    console.log("TLS klient: server autoriseeris ühenduse.");
  }
  else {
    console.log("TLS klient: server ei autoriseerinud ühendust " +
      socket.authorizationError)
  }

  let serverisert = socket.getPeerCertificate();
  console.log('TLS klient: server esitas serdi:');
  console.log(JSON.stringify(
    serverisert,
    ['subject', 'issuer', 'C', 'O', 'CN', 'valid_from', 'valid_to'],
    ' '));

  // Saada logikirjed
  logikirjed.forEach((logikirje) => {
    console.log('TLS klient: saadetud: ' + logikirje);
    socket.write(logikirje);
  });

  // Sule ühendus 3 s pärast
  setTimeout(() => {
    socket.destroy();
  }, 3000);
  console.log('TLS klient: ühendus suletud');
});

socket.on('data', (data) => {
  console.log('TLS klient: TLS serverilt saadud: ' + data);
  // client.destroy(); // kill client after server's response
});

socket.on('close', () => {
  console.log('TLS klient: TLS serveriga ühendus suletud');
});

socket.on('error', (ex) => {
  console.log("TLS klient: viga käsitletud");
  console.log(ex);
});