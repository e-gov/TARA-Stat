/**
 * TARA-Stat - Mikroteenus TARA statistika kogumiseks ja
 * vaatamiseks
 * 
 * Veebirakenduse kogu kood on siinses failis.
 * 
 * Node.js callback-de tõttu
 * on peamine töötsükkel asetatud MongoDB-ga ühenduse võtmise 
 * callback-i sisse. Kõigepealt luuakse ühendus MongoDB-ga. Seejärel 
 * käivitatakse Express veebirakendus (mis hakkab väljastama 
 * kasutusstatistikat) ja TLS server (mis hakkab vastu võtma 
 * logikirjeid).
 * 
 * Dokumentatsioon: https://e-gov.github.io/TARA-Stat/Dokumentatsioon
 * 
 * @author Priit Parmakson, 2018
 */

'use strict';

// -------- 1 Teekide laadimine  --------
const tls = require('tls'); // TCP ühenduste teek (TLS-ga)
const ReadWriteLock = require('rwlock'); // Lukuteek
const https = require('https'); // HTTPS (Node.js)
const fs = require('fs'); // Sertide laadimiseks
const path = require('path');
const util = require('util'); // Logimiseks
const express = require('express'); // Veebiraamistik Express
// HTTP päringu parsimisvahend. NB! Ainult application/JSON
const bodyParser = require('body-parser');
// Node.JS utiliidid
const f = require('util').format;
// MongoDB
const MongoClient = require('mongodb').MongoClient;

// Alusta lukuhaldur
var lock = new ReadWriteLock();

// -------- 2 Konf-i laadimine  --------
var config = require('/opt/tara-stat/config/config.js');

// -------- 3 Globaalsed muutujad -------- 
// MongoDB klient. Operatsioon "connection" teeb MongoClient uue
// instantsi, mis omistatakse allolevale muutujale.
var globClient;
// Ühendus MongoDB andmebaasiga "logibaas". Deklareeritud siin,
// et oleks elutukse väljastajas kättesaadav.
var db;
// Andmebaasiga ühendumise URL
// NB! Konto andmebaas - users - on URL-i hardcoded.
const authMechanism = 'DEFAULT';
const MONGODB_URL =
  f('mongodb://%s:%s@localhost:27017/users?authMechanism=%s',
    config.MONGOUSER,
    config.MONGOUSERPWD,
    authMechanism);
console.log(MONGODB_URL);

// -------- 4 Väiksemad ettevalmistused -------- 

// Rakenduse enda logimise sisseseadmine
// Märkus. Silumisel arvestada, et teise või sudo-õigusteta
// kasutaja alt käivitamisel logifaili jätkamine ebaõnnestub
// õiguste puudumise tõttu
var logFile = fs.createWriteStream(config.LOGIFAIL, { flags: 'a' });
// Või 'w' faili uuesti alustamiseks
var logStdout = process.stdout;
console.log = function () {
  let utc = new Date().toJSON();
  logFile.write('TARA-Stat: ' + utc + ' ' +
    util.format.apply(null, arguments) + '\n');
  logStdout.write('TARA-Stat: ' + utc + ' ' +
    util.format.apply(null, arguments) + '\n');
}
console.error = console.log;
console.log('Käivitun');

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
  res.render('pages/index');
});

// Väljasta edukate autentimiste arv perioodil
app.get('/standard', function (req, res) {
  const p = req.query.p; // Periood
  var r = (p) ? new RegExp(p) : new RegExp('.*'); // regex
  looYhendus()
    .then(() => {
      if (db !== null) {
        db.collection('autentimised').countDocuments(
          {
            time: { $regex: r },
            operation: "SUCCESSFUL_AUTH"
          }
        )
          .then((data) => {
            // console.log('/standard: väljastan tulemuse: ' + data.toString());
            res.send({ err: null, kirjeid: data });
          })
          .catch((err) => {
            console.log('/standard: ERR-02: Logibaasist lugemine ebaõnnestus: ',
              err);
            res.send({ err: "ERR-02: Logibaasist lugemine ebaõnnestus" });
          });
      }
      else {
        res.send({ err: "ERR-01: Logibaasiga ei saa ühendust" });
      }
    })
    .catch((err) => {
      console.log('/standard: ERR-01: Logibaasiga ei saa ühendust ',
        err);
      res.send({ err: "ERR-01: Logibaasiga ei saa ühendust" });
    });
});

// Väljasta kirjete arv
app.get('/kirjeid', (req, res) => {
  const p = req.query.p; // Periood
  var r = (p) ? new RegExp(p) : new RegExp('.*'); // regex
  looYhendus()
    .then(() => {
      if (db !== null) {
        db.collection('autentimised').countDocuments(
          {
            time: { $regex: r },
            // operation: "SUCCESSFUL_AUTH"
          })
          .then(
            (c) => {
              // console.log('/kirjeid: Kirjeid kokku: ', c);
              res.send({ err: null, kirjeid: c });
            })
          .catch((err) => {
            console.log('/kirjeid: ERR-02: Viga logibaasist lugemisel');
            res.send({ err: "ERR-02: Viga logibaasist lugemisel" });
          });
      }
      else {
        res.send({ err: "ERR-01: Logibaasiga ei saa ühendust" });
      }
    })
    .catch((err) => {
      console.log('/kirjeid: ERR-01: Logibaasiga ei saa ühendust ',
        err);
      res.send({ err: "ERR-01: Logibaasiga ei saa ühendust" });
    });
});

// Väljasta vanima kirje kuupäev
app.get('/alates', (req, res) => {
  looYhendus()
    .then(() => {
      if (db !== null) {
        db.collection('autentimised')
          .find()
          .sort({ time: 1 })
          .limit(1)
          .toArray()
          .then(
            (c) => {
              const d = c[0].time.substr(0, 10);
              // console.log('/alates: Vanim logikirje: ', d);
              res.send({ err: null, alates: d });
            })
          .catch((err) => {
            console.log('/alates: ERR-02: Viga logibaasist lugemisel');
            res.send({ err: "ERR-02: Viga logibaasist lugemisel" });
          });
      }
      else {
        res.send({ err: "ERR-01: Logibaasiga ei saa ühendust" });
      }
    })
    .catch((err) => {
      console.log('/alates: ERR-01: Logibaasiga ei saa ühendust ',
        err);
      res.send({ err: "ERR-01: Logibaasiga ei saa ühendust" });
    });
});

// Kustuta kirjed, vastavalt päringumustrile
app.delete('/kustuta', (req, res) => {
  // console.log('Alustan kustutamist');
  /* Võta päringu query-osast sirvikust saadetud perioodimuster */
  const p = req.query.p; // kui parameeter päringus puudub, siis undefined
  var r = (p) ? new RegExp(p) : new RegExp('.*'); // regex
  looYhendus()
    .then(() => {
      if (db !== null) {
        db.collection('autentimised')
          .deleteMany(
            {
              time: { $regex: r }
            })
          .then((opTulemus) => {
            var k = opTulemus.deletedCount;
            // console.log('Kustutasin ' + k + ' kirjet');
            res.send({ err: null, kustutati: k });
          })
          .catch((err) => {
            console.log('/kustuta: ERR-06: Kustutamine ebaõnnestus');
            res.send({ err: "ERR-06: Kustutamine ebaõnnestus" });
          });
      }
      else {
        res.send({ err: "ERR-01: Logibaasiga ei saa ühendust" });
      }
    })
    .catch((err) => {
      console.log('/kirjeid: ERR-01: Logibaasiga ei saa ühendust ',
        err);
      res.send({ err: "ERR-01: Logibaasiga ei saa ühendust" });
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
  /* Võta päringu query-osast sirvikust saadetud perioodimuster */
  const p = req.query.p; // kui parameeter päringus puudub, siis undefined
  var r = (p) ? new RegExp(p) : new RegExp('.*'); // regex
  looYhendus()
    .then(() => {
      if (db !== null) {
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
          .toArray()
          .then((kirjed) => {
            // console.log('/stat: Päring baasi täidetud. Leitud kirjeid: ' +
            //  kirjed.length);
            res.send(
              { err: null, kirjed: kirjed });
          })
          .catch((err) => {
            console.log('ERR-02: Viga andmete lugemisel logibaasist');
            res.send({ err: 'ERR-02: Viga andmete lugemisel logibaasist' });
          });
      }
      else {
        console.log("/stat: ERR-01: Logibaasiga ei saa ühendust");
        res.send({ err: "ERR-01: Logibaasiga ei saa ühendust" });
      }
    })
    .catch((err) => {
      console.log('/stat: ERR-01: Logibaasiga ei saa ühendust ',
        err);
      res.send({ err: "ERR-01: Logibaasiga ei saa ühendust" });
    });
});

// Vasta elusolekupäringule
app.get('/status', function (req, res) {
  // Tee proovisalvestus MongoDB andmebaasi
  var lisamiseTulemus;
  looYhendus()
    .then(() => {
      if (db !== null) {
        lisamiseTulemus = db.collection(config.HEARTBEATHELPERTABLE)
          .insert({
            kirjeldus: 'elutukse'
          });
        if (lisamiseTulemus.writeError) {
          console.log("ERR-05: Kirjutamine logibaasi ebaõnnestus");
          res.status(500).send('ERR-05: Kirjutamine logibaasi ebaõnnestus')
        }
        res.status(200).send('OK');
      }
      else {
        console.log("/status: ERR-01: Logibaasiga ei saa ühendust");
        res.status(500).send({ err: "ERR-01: Logibaasiga ei saa ühendust" });
      }
    })
    .catch((err) => {
      console.log('/status: ERR-01: Logibaasiga ei saa ühendust ',
        err);
      res.send({ err: "ERR-01: Logibaasiga ei saa ühendust" });
    });
});

// -------- 6 Mitmesugused töötlusfunktsioonid -------- 

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

/**
 * Logikirje salvestamine logibaasi (MongoDB)
 * @param logikirje {String} saadetud logikirje, JSON-struktuur
 */
function salvestaLogikirje(logikirje) {
  // Parsi JSON objektiks
  var kirjeObjektina;
  try {
    kirjeObjektina = JSON.parse(logikirje);
  } catch (e) {
    console.log('Ei suuda logikirje JSON-it parsida');
    return;
  }

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
  looYhendus();
  lisamiseTulemus = db
    .collection(config.COLLECTION)
    .insertOne(salvestatavKirje);
  if (lisamiseTulemus.writeError) {
    console.log("ERR-05: Kirjutamine logibaasi ebaõnnestus");
  }
  else {
    // console.log(' Kirje lisatud logibaasi');
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
  if (osad.length > 1) {
    let logikirje = '{' + osad[1];
    console.log(' ' + logikirje);
    salvestaLogikirje(logikirje);
  }
  else {
    console.log('Ei suuda Syslog kirjest JSON-t eraldada');
  }
}

/** -------- 7 Defineeri TLS server --------
 * Node.js 'tls' mooduliga
*/

// Vii usaldusankrute loetelu sobivale kujule
var caList = [];
for (let anchor of config.TLS_S_CA) {
  caList.push(
    fs.readFileSync(
      path.join(
        __dirname,
        '..',
        'config',
        'keys',
        anchor),
      'utf8'
    )
  )
  console.log('Paigaldatud usaldusankur: ' + anchor);
}

// Valmista TLS Serveri seaded
var TLS_S_options = {
  key: fs.readFileSync(
    path.join(
      __dirname, '..', 'config', 'keys',
      config.TLS_S_KEY), 'utf8'
  ),
  cert: fs.readFileSync(
    path.join(
      __dirname, '..', 'config', 'keys',
      config.TLS_S_CERT), 'utf8'
  ),
  ca: caList,
  requestCert: true,
  rejectUnauthorized: true
};

// Defineeri TLS server
const tcpTlsServer = tls.createServer(
  TLS_S_options,
  (socket) => {
    // console.log('TLS Server: ühendusevõtt aadressilt ' + socket.remoteAddress + ':' + socket.remotePort);
    let kliendisert = socket.getPeerCertificate();
    // console.log('TLS Server: klient esitas serdi:');
    // console.log(JSON.stringify(
    //  kliendisert,
    //  ['subject', 'issuer', 'C', 'O', 'CN', 'valid_from', 'valid_to'],
    //  ' '));

    // Kas kliendi autoriseerimine õnnestus?
    if (socket.authorized) {
      // console.log("TLS Server: autoriseerisin ühenduse.");
    }
    else {
      console.log("TLS Server: ei autoriseerinud ühendust " +
        socket.authorizationError)
    }
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
      // console.log('Saadud: ' + data.length + ' baiti');
      // Võta andmepuhvrisse kirjutamise lukk
      lock.writeLock(function (release) {
        // Lisa saabunud andmed puhvrisse
        buffered += data;
        // Kui puhveri sisu saab nii pikaks, et see viitab
        // ebakorrektsele sisendile, võimalikule ründele - 
        // reavahetuste puudumisele - siis ignoreeri ja tühjenda
        // puhver
        if (buffered.length > 10000) {
          console.log('Puhvri täitumine (> 1000 märki).' +
            ' Viitab reavahetuste puudumisele. Ignoreerin saadetud andmeid.');
          buffered = '';
        }
        else {
          // Eemalda puhvrist täiskirjed
          eraldaKirjedAndmepuhvrist();
        }
        // Vabasta lukk
        release();
      });

    });

    // Ühenduse sulgemise käsitleja
    socket.on('close',
      () => {
        // console.log('TARA-Stat: ühendus suletud');
      });

    // Ühenduse vea käsitleja
    socket.on('error',
      (errorMessage) => {
        console.log("Viga logikirje vastuvõtmisel (TCP");
        console.log(errorMessage);
      });

    // console.log('Ühendusevõtt aadressilt ' + socket.remoteAddress + ':' + socket.remotePort);
    socket.write(`TARA-Stat kuuldel\r\n`);

  });

// -------- 8 Defineeri HTTPS server -------- 
// Valmista ette HTTPS serveri suvandid
var HTTPS_S_options = {
  ca: fs.readFileSync(
    path.join(__dirname, '..', 'config', 'keys',
      config.CA_CERT), 'utf8'),
  key: fs.readFileSync(
    path.join(__dirname, '..', 'config', 'keys',
      config.HTTPS_KEY), 'utf8'),
  cert: fs.readFileSync(
    path.join(__dirname, '..', 'config', 'keys',
      config.HTTPS_CERT), 'utf8'),
  requestCert: false,
  rejectUnauthorized: false
};
var httpsServer = https.createServer(HTTPS_S_options, app);

// -------- 9 Käivita TLS ning HTTPS serverid -------- 

// Käivita TLS server
tcpTlsServer.listen(config.TLS_S_PORT, () => {
  console.log('TLS server kuuldel pordil: ' + config.TLS_S_PORT);
});

// Käivita HTTPS server 
httpsServer.listen(config.HTTPS_S_PORT, () => {
  console.log('HTTPS server kuuldel pordil: ' + httpsServer.address().port);
});

// Proovi ühenduda logibaasiga
looYhendus();