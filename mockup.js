/**
 * TARA-Stat logikirjete lisamise otspunkti testimise
 * makettrakendus
 * 
 * Genereerib logikirjeid ja lisab need logibaasi
 */

/* Konf-i laadimine */
var config = require('./mockup-config');

/* HTTP kliendi teek
  Vt https://www.npmjs.com/package/request 
  http://stackabuse.com/the-node-js-request-module/
*/
const requestModule = require('request');

/* HTTP päringute silumisvahend. Praegu välja lülitatud */
// require('request-debug')(requestModule);

/* Logiteenuse URL */
const TARA_STAT_URL = config.TARASTATURL;

/* Logiteenuse API kasutajanimi ja võti */
const API_USER = config.TARASTATUSER;
const API_KEY = config.TARASTATSECRET;

/* Logikirjete vahemiku algus */
var a = { y: 2018, m: 4, d: 1 };
/* Logikirjete vahemiku lõpp */
var b = { y: 2018, m: 7, d: 2 };
/* Logikirjete arv */
const N = 60;
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

console.log('--- TARA-Stat makettrakendus');
console.log('--- Genereerin ' + N.toString() + ' logikirjet');
for (var i = 0; i < N; i++) {
  // Moodusta saadetav kirje
  var saadetav_kirje = {
    "message": {
      "time": genereeriKuupaev(a, b),
      "clientId": klientrakendused[getRandomInt(0, klientrakendused.length - 1)],
      "method": meetodid[getRandomInt(0, meetodid.length - 1)],
      "operation": operatsioonid[getRandomInt(0, operatsioonid.length - 1)]
    }
  }
  if (saadetav_kirje.message.operation == 'ERROR') {
    saadetav_kirje.message.error = veateated[getRandomInt(0, veateated.length - 1)]
  }
  saadaLogisse(TARA_STAT_URL, saadetav_kirje);
}

return

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
 * Saadab kirje logibaasi (Mongo DB)
 */
function saadaLogisse(url, saadetav_kirje) {
  const body = JSON.stringify(saadetav_kirje);
  /* Valmista HTTP Authorization päise väärtus */
  const B64_VALUE = new Buffer(API_USER + ":" + API_KEY).toString('base64');
  console.log('---- Saadan logisse: ' + body);
  var options = {
    url: TARA_STAT_URL,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Authorization': 'Basic ' + B64_VALUE
    },
    body: body,
    rejectUnauthorized: false
  };
  requestModule(
    options,
    function (error, response, body) {
      if (error) {
        console.log('--- Viga logiteenuse poole pöördumisel: ', error);
        return;
      }
      console.log('--- Logikirje saadetud. HTTP staatuskood: ' +
        response.statusCode + ' ' + body);
    });
}

/**
 *  Tagastab juhusliku täisarvu vahemikus [min, max]
 */
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
