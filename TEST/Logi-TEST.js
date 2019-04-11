/**
 * Genereerib juhuslikke logikirjeid ja saadab need 
 * iseallkirjastatud sertidega (self-signed) turvatud
 * Syslog TCP ühenduse kaudu TARA-Stat logibaasi.
 * 
 * Ühenduse osas on eeskujuks TLS-K-TEST.js, kuid erinevalt
 * viimasest toetab ainult iseallkirjastatud serte.
 * 
 * Kasutamine: node Logi-TEST <host> <port>
 * kus:
 *   <host> - TARA-Stat domeeninimi
 *   <port> - logikirjete vastuvõtu port
 */

'use strict';
const tls = require('tls');
const fs = require('fs');
const path = require('path');

// Loe ja kontrolli käivitamisel antud parameetrid
const kaivitamiseParameetrid = process.argv;
if (kaivitamiseParameetrid.length != 4) {
  console.log('TLS server: Liiga vähe või palju parameetreid');
  kuvaKasutusteave();
  return
}
const TLS_SERVER_HOST = kaivitamiseParameetrid[2];
const TLS_SERVER_PORT = kaivitamiseParameetrid[3];

function kuvaKasutusteave() {
  console.log('Kasuta nii: node Logi-TEST <host> <port>');
}

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
  console.log('TCP klient: saadetud: ' + syslogKirje);
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
var TLS_C_OPTIONS = {
  host: TLS_SERVER_HOST,
  port: TLS_SERVER_PORT,
  requestCert: true,
  rejectUnauthorized: true,
  ca: fs.readFileSync(
    path.join(__dirname, 'keys-TEST',
      'tls-server-SELF-TEST.cert'), 'utf8'),
  key: fs.readFileSync(
    path.join(__dirname, 'keys-TEST',
      'tls-client-SELF-TEST.key'), 'utf8'),
  cert: fs.readFileSync(
    path.join(__dirname, 'keys-TEST',
      'tls-client-SELF-TEST.cert'), 'utf8')
}

// Loo TCP klient TARA-Stat-ga ühendumiseks

// Loo ühendus, genereeri ja saada logikirjed
const client = tls.connect(
  TLS_C_OPTIONS,
  () => {
    console.log('TCP klient: TARA-Stat-ga ' + TLS_SERVER_HOST +
      ':' + TLS_SERVER_PORT + ' ühendus loodud');

    // Genereeri ja saada logikirjed
    genereeriJaSaadaLogikirjed(client);

    // Sule ühendus 10 s pärast. NB! Saatmised on async
    setTimeout(() => {
      client.destroy();
    }, 10000);
  });

// Sea TCP kliendi sündmusekäsitlejad 
client.on('data', function (data) {
  console.log('TCP klient: TARA-Stat-lt saadud: ' + data + '\n');
});

client.on('close', function () {
  console.log('TCP klient: TARA-Stat-ga ühendus suletud \n');
});

client.on('error', function (ex) {
  console.log("TCP klient: viga käsitletud");
  console.log(ex);
});
