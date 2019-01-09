'use strict';

const f = require('util').format;
const MongoClient = require('mongodb').MongoClient;

// MongoDB klient. Operatsioon "connection" teeb MongoClient uue
// instantsi, mis omistatakse allolevale muutujale.
var globClient;
// Ühendus MongoDB andmebaasiga "Logibaas". Deklareeritud siin,
// et oleks elutukse väljastajas kättesaadav.
var db;
const MONGODB_URL = 'mongodb://localhost:27017';

/** Kontrollib, kas ühendus MongoDB-ga (mida hoiab globClient),
 * on üleval. Kui on, siis tagastab true. Vastasel korral üritab
 * luua uue ühenduse. Kui see õnnestub, siis salvestab ühenduse
 * loomisega loodava uue kliendi globaalmuutujasse globClient
 * ja tagastab true. Muutujas db tagastab logibaasiga ühenduse.
 * Kui ühendumine ei õnnestu, siis tagastab false.
 */
function looVoiUuendaYhendus() {
  if (globClient && globClient.isConnected()) {
    console.log('--- Logibaasiga ühendus olemas ---');
    return false;
  }
  else {
    MongoClient.connect(
      MONGODB_URL,
      { useNewUrlParser: true },
      (err, client) => {
        // client on uus MongoClient-i instance
        if (err === null) {
          console.log("--- Logibaasiga ühendumine õnnestus");
          globClient = client;
          db = globClient.db('Logibaas');
        }
        else {
          console.log("ERR-01: Logibaasiga ühendumine ebaõnnestus");
        }
      });

  }
}

/** Kontrollib, kas baasiühendus on olemas ja toimib
 * (globaalne muutuja globClient). Kui ei ole, siis üritab
 * luua ühenduse. Ühenduse loomisel seatakse ka globaalne
 * muutuja db osutama andmebaasile "logibaas". 
 * looYhendus() on async funktsioon s.t tagastab lubaduse. Lubaduse
 * töötlemiseks kasuta .then(() => {}) konstruktsiooni.
 */
async function looYhendus() {
  try {
    if (globClient && globClient.isConnected()) {
      console.log('Ühendus olemas');
      return;
    }
    var klient = await MongoClient.connect(MONGODB_URL,
      { useNewUrlParser: true });
    console.log('Ühendus loodud');
    globClient = klient;
    db = klient.db('logibaas');
  }
  catch (err) {
    console.log('Ühenduse loomine ebaõnnestus', err);
    db = null;
    globClient = null;
  };
}

/** Kasutame f-ni looYhendus(), et väljastada kõik
 * kirjed tabelist "autentimised".
 */
looYhendus().then(
  () => {
  if (db !== null) {
    console.log('Kirjed:');
    db.collection('autentimised')
    .find({ method: 'mID' })
    .toArray((err, items) => {
      console.log(items)
    });
  }
});
