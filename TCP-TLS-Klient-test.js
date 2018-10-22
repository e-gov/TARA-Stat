/*
  TCP-TLS-Klient-test.js - TARA-Stat-le logikirjeid saatev testrakendus 

  Saadab 3 Syslog vormingus logikirjet, TCP TLS kaudu
  
*/

'use strict';
const tls = require('tls');
const fs = require('fs');

let HOST = 'tara-stat-makett.ci.kit';
// let HOST = 'localhost';
let PORT = 5002;

const SELFSIGNED = true;
const TCP_TLS_TEST_KEY = 'tcp-tls-test.key';
const TCP_TLS_TEST_CERT = 'tcp-tls-test.cert';

// Test-logikirjed. Kirje lõpus on \n (0x0A)
let logikirjed = [
  '<38>Aug  1 10:51:54 acf2e2b322ab {"time":"2018-08-01T10:51:54.542","clientId":"openIdDemo","method":"mID","operation":"START_AUTH"}\n',
  '<38>Aug  1 10:52:05 acf2e2b322ab {"time":"2018-08-01T10:52:05.252","clientId":"openIdDemo","method":"mID","operation":"SUCCESSFUL_AUTH"}\n',
  '<38>Aug  1 10:53:54 acf2e2b322ab {"time":"2018-08-01T10:53:54.261","clientId":"openIdDemo","method":"mID","operation":"ERROR","error":"NO_AGREEMENT: User is not a Mobile-ID client"}\n',
];

// Valmista ette suvandid
if (SELFSIGNED) {
  // Valmista ette self-signed sert
  var voti = fs.readFileSync(path.join(__dirname, '..', 'keys',
    TCP_TLS_TEST_KEY), 'utf8');
  var sert = fs.readFileSync(path.join(__dirname, '..', 'keys',
    TCP_TLS_TEST_CERT), 'utf8');
  var options = {
    host: HOST,
    port: PORT,
    key: voti,
    cert: sert,
    requestCert: true,
    rejectUnauthorized: true
  };
}
else {
  // Loe pfx-fail
  var options = {
    host: HOST,
    port: PORT,
    pfx: fs.readFileSync(path.join(__dirname, '..', 'keys',
      config.TCP_TLS_PFX)),
    passphrase: 'changeit',
    requestCert: true,
    rejectUnauthorized: true
  };
}

let client = tls.Socket();

client.connect(options, () => {
  console.log('TCP-Klient: TARA-Stat-ga ' + HOST + ':' + PORT + ' ühendus loodud');
  // Saada logikirjed
  logikirjed.forEach((logikirje) => { 
    console.log('TCP-Klient: saadetud: ' + logikirje);
    client.write(logikirje);
  });
  // Sule ühendus 3 s pärast
  setTimeout(() => { 
    client.destroy();
  }, 3000); 
  console.log('TCP-Klient: ühendus suletud');
});

client.on('data', (data) => {
	console.log('TCP-Klient: TARA-Stat-lt saadud: ' + data);
	// client.destroy(); // kill client after server's response
});

client.on('close', () => {
	console.log('TCP-Klient: TARA-Stat-ga ühendus suletud');
});

client.on('error', (ex) => {
  console.log("TCP-Klient: viga käsitletud");
  console.log(ex);
});