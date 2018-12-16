/**
 * Genereerin logikirjeid ja salvestan need Logibaasi.
 * Käivitada mongo abil.
 */

'use strict';

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

var conn = new Mongo();
var db = conn.getDB("Logibaas");

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
  db.logibaas.insertOne(saadetavKirje);
}
