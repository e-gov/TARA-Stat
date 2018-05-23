/*
  TARA-Stat - Mikroteenus TARA statistika kogumiseks 
  ja vaatamiseks

  Priit Parmakson, 2018

*/

'use strict';

/* Konf-i laadimine */
/* Linux
var config = require('./config');
*/
var config = require('./config');

/* Teekide laadimine */
/** HTTPS
 *   vt https://www.kevinleary.net/self-signed-trusted-certificates-node-js-express-js/
 */
var https = require('https');

/* Sertide laadimiseks */
var fs = require('fs');
var path = require('path');

/* Logimiseks */
var util = require('util');

/* Veebiraamistik Express */
const express = require('express');

/*
 * HTTP päringu parsimisvahend
 * NB! AInult application/JSON
 *  */
const bodyParser = require('body-parser');

/* Basic Authentication vahend */
var auth = require('basic-auth');

/* Node.JS utiliidid */
const f = require('util').format;

/* MongoDB */
const MongoClient = require('mongodb').MongoClient;

/* Logimise sisseseadmine */
const LOGIFAIL = config.logifail;
var logFile = fs.createWriteStream(LOGIFAIL, { flags: 'a' });
// Või 'w' faili uuesti alustamiseks
var logStdout = process.stdout;

console.log = function () {
  logFile.write(util.format.apply(null, arguments) + '\n');
  logStdout.write(util.format.apply(null, arguments) + '\n');
}
console.error = console.log;

/* Veebiserveri ettevalmistamine */
const app = express();
/* TODO: Eemaldada?
app.set('port', 5000); */

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

/**
 * HTTPS suvandid
 * Vt: https://stackoverflow.com/questions/32705219/nodejs-accessing-file-with-relative-path 
 */
var voti = fs.readFileSync(path.join(__dirname, '..', 'keys', config.key),
  'utf8');

/* Valmista ette sert koos vahe-CA serdiga - või self-signed sert */
/*
if (config.selfsigned) {
  var sert = fs.readFileSync(path.join(__dirname, '..', 'keys',
    config.cert),
      'utf8');
}
else {
  var sert = [
    fs.readFileSync(path.join(__dirname, '..', 'keys', config.cert),
      'utf8'),
    fs.readFileSync(path.join(__dirname, '..', 'keys', config.intermediate),
      'utf8')
  ];
}
var options = {
  key: voti,
  cert: sert,
  requestCert: false,
  rejectUnauthorized: false
};
*/

var options = {
  pfx: fs.readFileSync(path.join(__dirname, '..', 'keys', 'certificate.pfx')),
  passphrase: 'changeit',
  requestCert: false,
  rejectUnauthorized: false
};

/* HTTPS serveri loomine */
var port = config.port;
var server = https.createServer(options, app);

/**
 * Paigaldusparameetrid
 */
/* Andmebaasi nimi */
const LOGIBAAS = config.logibaas;
const COLLECTION = config.collection;
const ELUTUKSETABEL = config.heartbeathelpertable;

/* Andmebaasiga ühendumise kredentsiaalid */
const MONGO_USER = config.mongouser;
const MONGO_PWD = config.mongouserpwd;
const authMechanism = 'DEFAULT';

/* Logikirje lisamise API võti */
const TARA_STAT_USER = config.tarastatuser;
const TARA_STAT_SECRET = config.tarastatsecret;

/**
 * Andmebaasiga ühendumise URL
 * Vt 
 * https://docs.mongodb.com/manual/reference/connection-string/
 * ja http://mongodb.github.io/node-mongodb-native/3.0/tutorials/connect/authenticating/
 * NB! Konto andmebaas - users - on URL-i hardcoded.
 */
const MONGODB_URL =
  f('mongodb://%s:%s@localhost:27017/users?authMechanism=%s',
    MONGO_USER,
    MONGO_PWD,
    authMechanism);

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
      console.log("--- Logibaasiga ühendumine õnnestus");
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
   * @param r - aja filtri regex
   * @param db - andmebaasiühendus
   * @param callback - funktsioon, millele edastatakse MongoDB
   *   aggregation pipeline läbimise tulemusel saadud kirjed 
   */
  const leiaKlienditi = function (r, db, callback) {
    const collection = db.collection(COLLECTION);
    /* Autentimine sisaldub juba andmebaasiga ühendumise URL-is 
      (MONGODB_URL) */
    collection
      .aggregate([
        {
          $match: {
            aeg: { $regex: r }
          }
        },
        {
          $group: {
            _id: {
              "klient": "$klient",
              "meetod": "$meetod"
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
        console.log(err);
        if (err === null) {
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

  // Ühendu logibaasi külge
  MongoClient.connect(MONGODB_URL, (err, client) => {
    if (err === null) {
      // console.log("--- Logibaasiga ühendumine õnnestus");
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
 * Kontrolli kredentsiaale (API-võtit)
 */
function check(name, pass) {
  // console.log('--- Kredentsiaalide kontroll');
  // console.log(name + ' = ' + TARA_STAT_USER + '?');
  // console.log(pass + ' = ' + TARA_STAT_SECRET + '?');
  return ((name === TARA_STAT_USER) && (pass === TARA_STAT_SECRET))
}

/**
 * Lisa logikirje
 * POST päring, kehas JSON
 * { "aeg": ..., "klient": ..., "meetod": ... }
 */
app.post('/',
  /* Kontrolli kredentsiaale */
  (req, res, next) => {
    var credentials = auth(req);
    if (!credentials || !check(credentials.name, credentials.pass)) {
      res.statusCode = 401;
      res.end('ERR-04: Logibaasi poole pöörduja autentimine ebaõnnestus');
    } else {
      // console.log('--- Logikirje lisaja autenditud');
      next();
    }
  },
  (req, res) => {
    // console.log('--- Logikirje lisamine');
    var aeg = req.body.aeg;
    var klient = req.body.klient;
    var meetod = req.body.meetod;
    // console.log(JSON.stringify(req.body));
    // console.log('aeg: ' + aeg + ', klient: ' + klient + ', meetod: ' + meetod);
    if (!aeg || !klient || !meetod) {
      res.status(400).send('ERR-03: Valesti moodustatud logikirje');
    }

    // Ühendu logibaasi külge
    MongoClient.connect(MONGODB_URL, (err, client) => {
      if (err === null) {
        // console.log("--- Logibaasiga ühendumine õnnestus");
        const db = client.db(LOGIBAAS);
        // WriteResult objekt
        var lisamiseTulemus;
        lisamiseTulemus = db.collection(COLLECTION)
          .insert({
            aeg: aeg,
            klient: klient,
            meetod: meetod
          });
        client.close();
        if (lisamiseTulemus.writeError) {
          console.log("ERR-05: Kirjutamine logibaasi ebaõnnestus");
          res.status(500).send('ERR-05: Kirjutamine logibaasi ebaõnnestus')
        }
        console.log('--- Kirje lisatud');
        res.status(200).send('OK');
      }
      else {
        console.log("ERR-01: Logibaasiga ühendumine ebaõnnestus");
        res.status(500).send('ERR-01: Logibaasiga ühendumine ebaõnnestus')
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
      const db = client.db(LOGIBAAS);
      // WriteResult objekt
      var lisamiseTulemus;
      lisamiseTulemus = db.collection(ELUTUKSETABEL)
        .insert({
          kirjeldus: 'elutukse'
        });
      if (lisamiseTulemus.writeError) {
        console.log("ERR-05: Kirjutamine logibaasi ebaõnnestus");
        res.status(500).send('ERR-05: Kirjutamine logibaasi ebaõnnestus')
      }
      client.close();
      res.status(200).send('OK');
    }
    else {
      console.log("ERR-01: Logibaasiga ühendumine ebaõnnestus");
      res.status(500).send('ERR-01: Logibaasiga ühendumine ebaõnnestus')
    }
  });
});

/**
 * Veebiserveri käivitamine 
 */

/* HTTP puhul
app.listen(app.get('port'), function () {
 console.log('---- TARA-Stat käivitatud ----');
});
*/
server.listen(port, function () {
  console.log('--- TARA-Stat kuulab pordil: ' + server.address().port);
});


