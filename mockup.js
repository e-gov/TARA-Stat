/**
 * TARA-Stat logikirjete lisamise otspunkti testimise
 * makettrakendus
 * 
 * Genereerib logikirjeid ja lisab need logibaasi
 */

/* HTTP kliendi teek
  Vt https://www.npmjs.com/package/request 
  http://stackabuse.com/the-node-js-request-module/
*/
const requestModule = require('request');

/* HTTP päringute silumisvahend. Praegu välja lülitatud */
// require('request-debug')(requestModule);

/* Logiteenuse URL */
const TARA_STAT_URL = 'https://localhost';

/* Logiteenuse API kasutajanimi ja võti */
const API_USER = 'changeit';
const API_KEY = 'changeit';

/* Logikirjete vahemiku algus */
var a = { y: 2018, m: 0, d: 1 };
/* Logikirjete vahemiku lõpp */
var b = { y: 2018, m: 4, d: 2 };
/* Logikirjete arv */
const N = 1;
var klientrakendused = [
  'klientrakendus A',
  'klientrakendus B',
  'klientrakendus C'];
var meetodid = ['MobileID', 'ID_CARD', 'eIDAS'];

for (var i = 0; i < N; i++) {
  saadaLogisse(
    TARA_STAT_URL,
    genereeriKuupaev(a, b),
    genereeriKlientrakendus(klientrakendused),
    genereeriMeetod(meetodid)
  );
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
  // console.log(d.toISOString());
  return d.toISOString();
}

function genereeriKlientrakendus(klientrakendused) {
  return klientrakendused[getRandomInt(0, klientrakendused.length - 1)];
}

function genereeriMeetod(meetodid) {
  return meetodid[getRandomInt(0, meetodid.length - 1)];
}

function saadaLogisse(url, kp, klientr, meetod) {
  var body = JSON.stringify({
    aeg: kp,
    klient: klientr,
    meetod: meetod
  });
  /* Valmista HTTP Authorization päise väärtus */
  const B64_VALUE = new Buffer(API_USER + ":" + API_KEY).toString('base64');
  console.log('---- Saadan logisse: ' + body);
  var options = {
    url: TARA_STAT_URL,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Basic ' + B64_VALUE
    },
    body: body,
    rejectUnauthorized: false
  };
  requestModule(
    options,
    function (error, response, body) {
      if (error) {
        console.log('Viga logiteenuse poole pöördumisel: ', error);
        return;
      }
      console.log(response.statusCode);
    });
}

/**
 *  Tagastab juhusliku täisarvu vahemikus [min, max]
 */
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
