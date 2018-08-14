/**
 * LogikirjeteSaatmiseTest.js
 * 
 * Genereerib logikirjeid ja lisab need TARA-STAT logibaasi
 */

// TARA-Stat-i domeeninimi ja logikirjete vastuvõtu port
// NB! Enne käivitamist sea tegelikud väärtused 
const HOST = 'sea tegelik';
const PORT = 5001;

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

console.log('\n LogikirjeteSaatmiseTest.js \n');

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

// Loo TCP klient TARA-Stat-ga ühendumiseks
const net = require('net');
let client = net.Socket();

// Sea TCP kliendi sündmusekäsitlejad 
client.on('data', function (data) {
  console.log('TCP-Klient: TARA-Stat-lt saadud: ' + data);
});

client.on('close', function () {
  console.log('TCP-Klient: TARA-Stat-ga ühendus suletud \n');
});

client.on('error', function (ex) {
  console.log("TCP-Klient: viga käsitletud");
  console.log(ex);
});

// Loo ühendus, genereeri ja saada logikirjed
client.connect(PORT, HOST, function () {
  console.log('TCP-Klient: TARA-Stat-ga ' + HOST +
   ':' + PORT + ' ühendus loodud');

  // Genereeri ja saada logikirjed
  genereeriJaSaadaLogikirjed(client);

  // Sule ühendus 10 s pärast. NB! Saatmised on async
  setTimeout(() => {
    client.destroy();
  }, 10000);
});
