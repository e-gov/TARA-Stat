/** ---------------------------------------------------------------
 *   TARA-STAT veebirakenduse konfiguratsioonifail config.js
 */

var config = {};

// Logifaili asukoht
config.LOGIFAIL = '/opt/TARA-Stat/log.txt';

// HTTPS Serveri port
config.HTTPSPORT = 5000; 

// TCP Serveri port
config.TCPPORT = 5001;

// Kas self-signed sert?
config.SELFSIGNED = false;

// HTTPS privaatvõtme failinimi
config.KEY = 'tara-stat.key';

// HTTPS serdi failinimi
config.CERT = 'tara-stat.cert';

// pfx-faili nimi (organisatsiooni CA puhul)
config.PFX = 'certificate.pfx';

// Andmebaasi nimi
config.LOGIBAAS = 'logibaas';

// Collection-i (andmetabeli) nimi
config.COLLECTION = 'autentimised';

// Elusolekukontrolli abitabel
config.HEARTBEATHELPERTABLE = 'elutukse';

// MongoDB URL
config.MONGODB_URL = 'mongodb://localhost:27017';

// Veebirakenduse kasutajakonto MongoDB-s
config.MONGOUSER = 'rakendus';

// ... ja selle parool
config.MONGOUSERPWD = 'MONGOUSERPWD-changeit';

module.exports = config;