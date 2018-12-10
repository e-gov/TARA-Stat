/**
 * LogikirjeteSaatmiseTest.js
 * 
 * Genereerin logikirjeid ja saadan need TARA-STAT-i (tara-stat-rakendus.ci.kit)
 * 
 * Käivitamine: node LogikirjeteSaatmiseTest
 * 
 */

'use strict';

// -------- 1 Teekide laadimine  --------
const tls = require('tls'); // TCP ühenduste teek (TLS-ga)
const fs = require('fs'); // Sertide laadimiseks
const path = require('path');

// -------- 2 Konf-i laadimine  --------
var config = require('/opt/tara-ci-config/TARA-Stat/config');

// Logikirjete vahemiku algus
var a = { y: 2018, m: 4, d: 1 };
// Logikirjete vahemiku lõpp
var b = { y: 2018, m: 7, d: 2 };
// Logikirjete arv
const N = 5;
const klientrakendused = [
  'klientrakendus A',
  'klientrakendus B',
  'klientrakendus C'];
const meetodid = [
  'mID',
  'idcard',
  'eIDAS',
  'banklink',
  'smartid'
];
const operatsioonid = [
  'START_AUTH',
  'SUCCESSFUL_AUTH',
  'ERROR'
];
const veateated = [
  'Veateade NNNN',
  'Veateade MMMM'
];

console.log('---  Genereerin logikirjeid ja saadan need TARA-STAT-i \n');

/**
 * Genereeri ja saada Syslog kirjed TARA-Stat-le 
 * @param {TCP klient} client 
 */
function genereeriJaSaadaLogikirjed(client) {
  console.log('--- Genereerin ' + N.toString() + ' logikirjet');
  for (let i = 0; i < N; i++) {
    // Moodusta saadetav kirje
    let saadetavKirje = {
      "time": genereeriKuupaev(a, b),
      "clientId": klientrakendused[getRandomInt(0, klientrakendused.length - 1)],
      "method": meetodid[getRandomInt(0, meetodid.length - 1)],
      "operation": operatsioonid[getRandomInt(0, operatsioonid.length - 1)]
    }
    if (saadetavKirje.operation == 'ERROR') {
      saadetavKirje.error = veateated[getRandomInt(0, veateated.length - 1)]
    }
    saadaLogisseSyslog(client, saadetavKirje);
  }
}

/**
 * Lisab Syslog-kirje standardse osa ja saadab TARA-Stat-le
 * @param {TCP klient} client 
 * @param {Object} saadetavKirje 
 */
function saadaLogisseSyslog(client, saadetavKirje) {
  // Lisa Syslog-kirje standardne osa
  let syslogPais = '<38>Aug  1 10:51:54 acf2e2b322ab ';
  let syslogKirje = syslogPais + JSON.stringify(saadetavKirje) + '\n';
  client.write(syslogKirje); // NB! Async
  console.log('TCP-Klient: saadetud: ' + syslogKirje);
}

/**
 * Genereerib etteantud vahemikus juhusliku kuupäeva
 * @param a {String} vahemiku algus, kujul { { y: 2018, m: 4, d: 1 }
 * @param b {String} vahemiku lõpp
 * @return genereeritud kuupäev, ISO sõnena
 */
function genereeriKuupaev(a, b) {
  var d = new Date(Date.UTC(
    getRandomInt(a.y, b.y),
    getRandomInt(a.m, b.m),
    getRandomInt(a.d, b.d),
    getRandomInt(0, 23),
    getRandomInt(0, 59),
    getRandomInt(0, 59)
  ));
  return d.toISOString();
}

/**
 *  Tagastab juhusliku täisarvu etteantud vahemikus
 * @param {Number} min
 * @param {Number} max
 */
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Valmista ette kliendi suvandid
var TLS_K_OPTIONS = {
  host: 'tara-stat-rakendus.ci.kit',
  port: config.TCP_TLS_PORT,
  ca: fs.readFileSync(
    path.join(__dirname, '..', '..', 'tara-ci-config', 'TARA-Stat', 'keys',
      config.TCP_TLS_CERT), 'utf8'),
  key: fs.readFileSync(
    path.join(__dirname, '..', '..', 'tara-ci-config', 'TARA-Stat', 'keys',
      config.TCP_TLS_KEY), 'utf8'),
  cert: fs.readFileSync(
    path.join(__dirname, '..', '..', 'tara-ci-config', 'TARA-Stat', 'keys',
      config.TCP_TLS_CERT), 'utf8'),
  requestCert: true,
  rejectUnauthorized: true
}

// Loo TLS klient, ühendu TLS serveriga
const socket = tls.connect(TLS_K_OPTIONS, () => {
  console.log('TLS klient: TARA-Stat-ga ' +
  config.TLS_S_HOST + ':' + config.TCP_TLS_PORT +
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

  // Genereeri ja saada logikirjed
  genereeriJaSaadaLogikirjed(socket);

  // Sule ühendus 3 s pärast
  setTimeout(() => {
    socket.destroy();
  }, 3000);
  console.log('TLS klient: sulgesin ühenduse');
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

