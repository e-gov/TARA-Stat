/*
  TARA-Stat - Mikroteenus TARA statistika kogumiseks 
  ja vaatamiseks

  Priit Parmakson, 2018
*/

'use strict';

/* Teekide laadimine */

/* Veebiraamistik Express */
const express = require('express');

/* HTTP päringu parsimisvahendid */
const bodyParser = require('body-parser');

/* MongoDB */
const MongoClient = require('mongodb').MongoClient;

/* Veebiserveri ettevalmistamine */
const app = express();
app.set('port', 5000);

/* Sea juurkaust, millest serveeritakse sirvikusse ressursse
 vt http://expressjs.com/en/starter/static-files.html 
 ja https://expressjs.com/en/4x/api.html#express.static */
app.use(express.static(__dirname + '/public'));

/* Sea rakenduse vaadete (kasutajale esitatavate HTML-mallide) kaust */
app.set('views', __dirname + '/views');

/* Määra kasutatav mallimootor */
app.set('view engine', 'ejs');

/* Vajalik seadistus MIME-tüübi application/json
parsimiseks */
app.use(bodyParser.json());

/* Andmebaasiühenduse loomine */
const MONGODB_URL = 'mongodb://localhost:27017';

// Andmebaasi nimi
const LOGIBAAS = 'logibaas';
const COLLECTION = 'autentimised';

/**
 *  Järgnevad marsruuteri töötlusreeglid
 */

/**
 * Kuva esileht
 */
app.get('/', function (req, res) {
  // Ühendu logibaasi külge
  MongoClient.connect(MONGODB_URL, (err, client) => {
    if (err === null) {
      console.log("Logibaasiga ühendumine õnnestus");
      res.render('pages/index');
      const db = client.db(LOGIBAAS);
      client.close();
    }
    else {
      console.log("ERR-01: Logibaasiga ühendumine ebaõnnestus");
      res.render('pages/viga', { veateade: "ERR-01: Logibaasiga ühendumine ebaõnnestus" });
    }
  });
});

/**
 * Väljasta statistika
 * (AJAX päring)
 */
app.get('/stat', (req, res) => {

  /**
   * Leia autentimiste arv klienditi
   */
  const leiaKlienditi = function (r, db, callback) {
    const collection = db.collection(COLLECTION);
    collection
      .aggregate([
        {
          $match: {
            aeg: { $regex: r }
          }
        },
        {
          $group: {
            _id: "$klient",
            kirjeteArv: { $sum: 1 }
          }
        }
      ])
      .toArray(function (err, kirjed) {
        console.log(err);
        if (err === null) {
          callback(kirjed);
        }
        else {
          console.log('ERR-02: Viga logibaasist lugemisel');
          res.render('pages/viga', { veateade: "ERR-02: Viga logibaasist lugemisel" });
        }
      });
  }

  /* Võta päringu query-osast sirvikust saadetud perioodimuster */
  const p = req.query.p;
  /* undefined, kui parameeter päringus puudub */
  console.log('Perioodimuster: ', p);
  /* Moodusta regex */
  var r;
  if (p) {
    r = new RegExp(p);
  }
  else {
    r = new RegExp('.*');
  }

  // Ühendu logibaasi külge
  MongoClient.connect(MONGODB_URL, (err, client) => {
    if (err === null) {
      console.log("Logibaasiga ühendumine õnnestus");
      const db = client.db(LOGIBAAS);
      leiaKlienditi(r, db, (kirjed) => {
        res.send(
          {
            kirjed: kirjed
          });
        client.close();
      });
    }
    else {
      console.log("ERR-01: Logibaasiga ühendumine ebaõnnestus");
      res.send({});
    }
  });
});

/**
 * Lisa logikirje
 * POST päring, kehas JSON
 * { "aeg": ..., "klient": ..., "meetod": ... }
 */
app.post('/', (req, res) => {
  console.log('--- Logikirje lisamine');
  var aeg = req.body.aeg;
  var klient = req.body.klient;
  var meetod = req.body.meetod;

  // Ühendu logibaasi külge
  MongoClient.connect(MONGODB_URL, (err, client) => {
    if (err === null) {
      console.log("Logibaasiga ühendumine õnnestus");
      const db = client.db(LOGIBAAS);
      db.collection(COLLECTION)
        .insert({
          aeg: aeg,
          klient: klient,
          meetod: meetod
        });
      client.close();
      res.status(200).send('OK');
    }
    else {
      console.log("ERR-01: Logibaasiga ühendumine ebaõnnestus");
      res.status(500).send('Internal Server Error')
    }
  });

});

/**
 * Vasta elusolekupäringule
 */
app.get('/status', function (req, res) {
  // Kontrolli andmebaasiühendust
  MongoClient.connect(MONGODB_URL, (err, client) => {
    if (err === null) {
      client.close();
      res.status(200).send('OK');
    }
    else {
      console.log("ERR-01: Logibaasiga ühendumine ebaõnnestus");
      res.status(500).send('Internal Server Error')
    }
  });
});

/**
 * Veebiserveri käivitamine 
 */
app.listen(app.get('port'), function () {
  console.log('---- TARA-Stat käivitatud ----');
});


