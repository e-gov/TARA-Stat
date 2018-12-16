
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