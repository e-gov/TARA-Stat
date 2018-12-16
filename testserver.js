/**
 * TARA-Stat - Testserver
 * 
 * Ilma logikirjete vastuvõtuta; HTTP server;
 * autentimata andmebaas
 */

'use strict';

// -------- 1 Teekide laadimine  --------
const http = require('http'); // HTTPS (Node.js)
const express = require('express'); // Veebiraamistik Express
// HTTP päringu parsimisvahend. NB! Ainult application/JSON
const bodyParser = require('body-parser');
// MongoDB
const MongoClient = require('mongodb').MongoClient;

// -------- 3 Globaalsed muutujad -------- 
// MongoDB andmebaasiühendus. Deklareeritud siin, et oleks elutukse
// väljastajas kättesaadav
var db;

// -------- 4 Väiksemad ettevalmistused -------- 

// Expressi ettevalmistamine
const app = express();

// Sea juurkaust, millest serveeritakse sirvikusse ressursse
app.use(express.static(__dirname + '/public'));

// Sea rakenduse vaadete (kasutajale esitatavate HTML-mallide) kaust
app.set('views', __dirname + '/views');

// Määra kasutatav mallimootor
app.set('view engine', 'ejs');

// Vajalik seadistus MIME-tüübi application/json parsimiseks
app.use(bodyParser.json());

// -------- 5 Express marsruuteri töötlusreeglid -------- 

// Kuva esileht
app.get('/', function (req, res) {
  // Kas logibaasiga ühendus on loodud?
  if (db !== null) {
    console.log("Logibaasiga ühendumine õnnestus");
    res.render('pages/index');
  }
  else {
    console.log("ERR-01: Logibaasiga ühendumine ebaõnnestus");
    res.render('pages/viga',
      { veateade: "ERR-01: Logibaasiga ühendumine ebaõnnestus" });
  }
});

// Väljasta kirjete arv
app.get('/kirjeid', (req, res) => {
    db.collection('autentimised').countDocuments({}).then(
      (c) => {
        console.log(c);
        res.send({ kirjeid: c });
      });
});

// Väljasta statistika (AJAX päring)
app.get('/stat', (req, res) => {

  /**
   * Leia autentimiste arv klienditi
   * @param r - aja filtri regex
   * @param db - andmebaasiühendus
   * @param callback - funktsioon, millele edastatakse MongoDB
   *   aggregation pipeline läbimise tulemusel saadud kirjed 
   */
  const leiaKlienditi = function (r, db, callback) {
    const collection = db.collection('autentimised');
    collection
      .aggregate([
        {
          $match: {
            time: { $regex: r }
          }
        },
        {
          $group: {
            _id: {
              "clientId": "$clientId",
              "method": "$method",
              "operation": "$operation",
              "bank": "$bank"
            },
            kirjeteArv: { $sum: 1 }
          }
        },
        {
          $sort: {
            _id: 1
          }
        }
      ])
      .toArray(function (err, kirjed) {
        if (err === null) {
          console.log('Päring andmebaasi täidetud. Leitud kirjeid: ' +
            kirjed.length);
          callback(kirjed);
        }
        else {
          console.log('ERR-02: Viga logibaasist lugemisel');
          /* TODO Ajax-päringule vastamisel see pole adekvaatne */
          res.render('pages/viga', { veateade: "ERR-02: Viga logibaasist lugemisel" });
        }
      });
  }

  /* Võta päringu query-osast sirvikust saadetud perioodimuster */
  const p = req.query.p;
  /* undefined, kui parameeter päringus puudub */
  // console.log('--- Perioodimuster: ', p);
  /* Moodusta regex */
  var r;
  if (p) {
    r = new RegExp(p);
  }
  else {
    r = new RegExp('.*');
  }

  // Tee otsing logibaasis ja saada tulemused
  leiaKlienditi(r, db, (kirjed) => {
    res.send(
      {
        kirjed: kirjed
      });
  });

});

// -------- 8 Defineeri HTTP server -------- 
var httpServer = http.createServer(app);

// -------- 9 Loo ühendus MongoDB - ga ja käivita
//            HTTP server             -------- 

MongoClient.connect(
  'mongodb://localhost',
  { useNewUrlParser: true },
  (err, client) => {
    if (err === null) {
      // console.log("--- Logibaasiga ühendumine õnnestus");
      db = client.db('logibaas');

      // Käivita HTTP server 
      httpServer.listen(5000, () => {
        console.log('HTTPS server kuuldel pordil: ' + 
        httpServer.address().port);
      });

    }
    else {
      console.log("ERR-01: Logibaasiga ühendumine ebaõnnestus");
    }
  });
