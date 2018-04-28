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
const qs = require('query-string');

/* HTTP kliendi teek
  Vt https://www.npmjs.com/package/request 
*/
const requestModule = require('request');

/* HTTP päringute silumisvahend. Praegu välja lülitatud */
// require('request-debug')(requestModule);

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

/* Vajalik seadistus MIME-tüübi
 application/x-www-form-urlencoded parsimiseks */
app.use(bodyParser.urlencoded({ extended: true }));

/* Andmebaasiühenduse loomine */
const MONGODB_URL = 'mongodb://localhost:27017';

// Andmebaasi nimi
const LOGIBAAS = 'db';

/**
 *  Järgnevad marsruuteri töötlusreeglid
 */

/**
 * Logi kirje
 */
app.get('/lisa', function (req, res) {
  console.log('--- Logikirje lisamine');
});

/**
 * Kuva esileht ja väljasta statistika
 */
app.get('/', function (req, res) {
  // Ühendu logibaasi külge
  MongoClient.connect(MONGODB_URL, (err, client) => {
    if (err === null) {
      console.log("Logibaasiga ühendumine õnnestus");
      res.render('pages/index', { connectionOK: true });
      // const db = client.db(LOGIBAAS);
      // client.close();
    }
    else {
      console.log("ERR-01: Logibaasiga ühendumine ebaõnnestus");
      res.render('pages/index', { connectionOK: false });
    }
  });
});

/**
 * Väljasta statistika
 */
app.get('/stat', function (req, res) {

  res.render('pages/index');
});

/**
 * Vasta elusolekupäringule
 */
app.get('/status', function (req, res) {

  res.send('TARA-Stat: OK');
});

/**
 * Veebiserveri käivitamine 
 */
app.listen(app.get('port'), function () {
  console.log('---- TARA-Stat käivitatud ----');
});


