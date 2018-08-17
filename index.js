/**
 * TARA-Stat - Mikroteenus TARA statistika kogumiseks ja
 * vaatamiseks
 * 
 * Veebirakenduse kogu kood on siinses failis. Node.js callback-de tõttu
 * on peamine töötsükkel asetatud MongoDB-ga ühenduse võtmise 
 * callback-i sisse. Kõigepealt luuakse ühendus MongoDB-ga. Seejärel 
 * käivitatakse Express veebirakendus (mis hakkab väljastama 
 * kasutusstatistikat) ja TCP server (mis hakkab vastu võtma 
 * logikirjeid).
 * 
 * @author Priit Parmakson, 2018
 */

'use strict';

// -------- 1 Teekide laadimine  --------

// TCP ühenduste teek
const net = require('net');

// Lukuteek
var ReadWriteLock = require('rwlock');

// HTTPS (Node.js)
var https = require('https');

// Sertide laadimiseks
var fs = require('fs');
var path = require('path');

// Logimiseks
var util = require('util');

// Veebiraamistik Express
const express = require('express');

// HTTP päringu parsimisvahend. NB! Ainult application/JSON
const bodyParser = require('body-parser');

// Node.JS utiliidid
const f = require('util').format;

// MongoDB
const MongoClient = require('mongodb').MongoClient;

// Alusta lukuhaldur
var lock = new ReadWriteLock();

// -------- 2 Konf-i laadimine  --------
var config = require('./config');

// -------- 3 Globaalsed muutujad -------- 
// MongoDB andmebaasiühendus. Deklareeritud siin, et oleks elutukse
// väljastajas kättesaadav
var db;

// -------- 4 Väiksemad ettevalmistused -------- 

// Rakenduse enda logimise sisseseadmine
// Märkus. Silumisel arvestada, et teise või sudo-õigusteta
// kasutaja alt käivitamisel logifaili jätkamine ebaõnnestub
// õiguste puudumise tõttu
var logFile = fs.createWriteStream(config.LOGIFAIL, { flags: 'a' });
// Või 'w' faili uuesti alustamiseks
var logStdout = process.stdout;
console.log = function () {
  logFile.write('TARA-Stat: ' + util.format.apply(null, arguments) + '\n');
  logStdout.write('TARA-Stat: ' + util.format.apply(null, arguments) + '\n');
}
console.error = console.log;
let utc = new Date().toJSON();
console.log(utc + ' Käivitun');

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
  let utc = new Date().toJSON();
  if (db !== null) {
    console.log(utc + " Logibaasiga ühendumine õnnestus");
    res.render('pages/index');
  }
  else {
    console.log(utc + " ERR-01: Logibaasiga ühendumine ebaõnnestus");
    res.render('pages/viga', { veateade: "ERR-01: Logibaasiga ühendumine ebaõnnestus" });
  }
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
    const collection = db.collection(config.COLLECTION);
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
        let utc = new Date().toJSON();
        if (err === null) {
          console.log(utc + ' Päring andmebaasi täidetud. Leitud kirjeid: ' +
            kirjed.length);
          callback(kirjed);
        }
        else {
          console.log(utc + ' ERR-02: Viga logibaasist lugemisel');
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

// Vasta elusolekupäringule
app.get('/status', function (req, res) {
  // Tee proovisalvestus MongoDB andmebaasi
  var lisamiseTulemus;
  lisamiseTulemus = db.collection(config.HEARTBEATHELPERTABLE)
    .insert({
      kirjeldus: 'elutukse'
    });
  if (lisamiseTulemus.writeError) {
    let utc = new Date().toJSON();
    console.log(utc + " ERR-05: Kirjutamine logibaasi ebaõnnestus");
    res.status(500).send('ERR-05: Kirjutamine logibaasi ebaõnnestus')
  }
  res.status(200).send('OK');
});

// -------- 6 Logikirje salvestamise abifunktsioonid -------- 
/**
 * Logikirje salvestamine logibaasi (MongoDB)
 * @param logikirje {String} saadetud logikirje, JSON-struktuur
 */
function salvestaLogikirje(logikirje) {
  // Parsi JSON objektiks
  let kirjeObjektina = JSON.parse(logikirje);

  // Kontrolli nõutavate elementide olemasolu
  if (
    !kirjeObjektina.time ||
    !kirjeObjektina.clientId ||
    !kirjeObjektina.method ||
    !kirjeObjektina.operation
  ) {
    console.log('ERR-03: Valesti moodustatud logikirje');
  }

  // Koosta salvestatav kirje
  var salvestatavKirje = {
    time: kirjeObjektina.time,
    clientId: kirjeObjektina.clientId,
    method: kirjeObjektina.method,
    operation: kirjeObjektina.operation
  };
  if (kirjeObjektina.error) {
    salvestatavKirje.error = kirjeObjektina.error;
  }
  if (kirjeObjektina.method == 'banklink') {
    salvestatavKirje.bank = kirjeObjektina.bank;
  }
  // console.log('Salvestatav kirje: ' +
  // JSON.stringify(salvestatavKirje, null, 2));

  // WriteResult objekt
  var lisamiseTulemus;
  lisamiseTulemus = db
    .collection(config.COLLECTION)
    .insertOne(salvestatavKirje);
  let utc = new Date().toJSON();
  if (lisamiseTulemus.writeError) {
    console.log(utc + " ERR-05: Kirjutamine logibaasi ebaõnnestus");
  }
  else {
    console.log(' Kirje lisatud logibaasi');
  }
}

/**
 * Eraldab Syslog-kirjest JSON-struktuuri -
 * logikirje - ja suunab selle logibaasi salvestamisele
 * Eeldab täpset vormingut.
 * @param syslogKirje {String} saadetud Syslog-kirje
 */
function tootleSyslogKirje(syslogKirje) {
  let osad = syslogKirje.split('{');
  let utc = new Date().toJSON();
  if (osad.length > 1) {
    let logikirje = '{' + osad[1];
    console.log(' ' + logikirje);
    salvestaLogikirje(logikirje);
  }
  else {
    console.log(utc + ' Ei suuda Syslog kirjest JSON-t eraldada');
  }
}

// -------- 7 Defineeri TCP server -------- 
let tcpServer = net.createServer((socket) => {

  // Defineeri ühenduses toimuvatele sündmustele käsitlejad

  /* Andmepuhver.
    TCP on madalama taseme protokoll, mis tähendab, et logikirje võib tulla mitmes tükis. Ja ka vastupidi, ühes tükis võib tulla mitu logikirjet. TARA-Stat-is tehakse tüki saamisel lõim. Lõimel kulub tüki töötlemiseks natuke aega. Järgmine tükk võib aga juba sisse tulla, sellele tehakse uus lõim, mis alustab omakorda töötlust. Vaja on tagada, et esimene lõim lõpetab enne töö, kui järgmine alustab. S.t vaja on mutex-it (lukustamist). Javas on mutex-võimalus sisse ehitatud. Node.JS-s aga mitte.    
    Sündmuse 'data' käsitlejad võivad üksteisele sisse sõita.
    Probleemi ei teki, kui iga kirje tuleb ühes tükis (aga
    tükis võib olla mitu kirjet).
    Lukustamiseks on siin kasutatud teeki rwlock.
  */
  var buffered = '';

  /**
   * Analüüsib andmepuhvrit buffered, eraldab ja suunab
   * töötlusele (tootleSyslogKirje) kõik reavahetusega lõppevad osad.
   */
  function eraldaKirjedAndmepuhvrist() {
    var received = buffered.split('\n');
    while (received.length > 1) {
      // Syslog kirje eraldatud
      let syslogKirje = received[0];
      buffered = received.slice(1).join('\n');
      received = buffered.split('\n');
      tootleSyslogKirje(syslogKirje);
    }
  }

  // Andmete saabumise käsitleja
  socket.on('data', function (data) {
    let utc = new Date().toJSON();
    console.log(utc + ' Saadud: ' + data.length + ' baiti');
    // Võta andmepuhvrisse kirjutamise lukk
    lock.writeLock(function (release) {
      // Lisa saabunud andmed puhvrisse
      buffered += data;
      // Eemalda puhvrist täiskirjed
      eraldaKirjedAndmepuhvrist();
      // Vabasta lukk
      release();
    });

  });

  // Ühenduse sulgemise käsitleja
  socket.on('close',
    () => {
      let utc = new Date().toJSON();
      console.log(utc + ' TARA-Stat: ühendus suletud');
    });

  // Ühenduse vea käsitleja
  socket.on('error',
    (errorMessage) => {
      let utc = new Date().toJSON();
      console.log(utc + " Viga logikirje vastuvõtmisel (TCP");
      console.log(errorMessage);
    });

  let utc = new Date().toJSON();  
  console.log(utc + ' Ühendusevõtt aadressilt ' + socket.remoteAddress + ':' + socket.remotePort);
  socket.write(`TARA-Stat kuuldel\r\n`);

});

// -------- 8 Defineeri HTTPS server -------- 
// Valmista ette HTTPS serveri suvandid
if (config.SELFSIGNED) {
  // Valmista ette self-signed sert
  var voti = fs.readFileSync(path.join(__dirname, '..', 'keys',
    config.KEY), 'utf8');
  var sert = fs.readFileSync(path.join(__dirname, '..', 'keys',
    config.CERT), 'utf8');
  var options = {
    key: voti,
    cert: sert,
    requestCert: false,
    rejectUnauthorized: false
  };
}
else {
  // Loe pfx-fail
  var options = {
    pfx: fs.readFileSync(path.join(__dirname, '..', 'keys',
      config.PFX)),
    passphrase: 'changeit',
    requestCert: false,
    rejectUnauthorized: false
  };
}
var httpsServer = https.createServer(options, app);

// -------- 9 Loo ühendus MongoDB - ga ja käivita
//            TCP ning HTTPS serverid             -------- 

// Andmebaasiga ühendumise URL
// NB! Konto andmebaas - users - on URL-i hardcoded.
const authMechanism = 'DEFAULT';
const MONGODB_URL =
  f('mongodb://%s:%s@localhost:27017/users?authMechanism=%s',
    config.MONGOUSER,
    config.MONGOUSERPWD,
    authMechanism);

MongoClient.connect(
  MONGODB_URL,
  { useNewUrlParser: true },
  (err, client) => {
    if (err === null) {
      // console.log("--- Logibaasiga ühendumine õnnestus");
      db = client.db(config.LOGIBAAS);

      // Käivita TCP server
      let utc = new Date().toJSON();
      tcpServer.listen(config.TCPPORT);
      console.log(utc + ' TCP-Server kuuldel pordil: ' + config.TCPPORT);

      // Käivita veebiserver 
      httpsServer.listen(config.HTTPSPORT, function () {
        console.log(utc + ' HTTPS-Server kuuldel pordil: ' + httpsServer.address().port);
      });

    }
    else {
      let utc = new Date().toJSON();
      console.log(utc + " ERR-01: Logibaasiga ühendumine ebaõnnestus");
    }
  });
