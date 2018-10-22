/** ---------------------------------------------------------------
 *   TARA-STAT veebirakenduse konfiguratsioonifail config.js
 */

var config = {};

// Logifaili asukoht
config.LOGIFAIL = '/opt/TARA-Stat/log.txt';

// CA sert
config.CA_CERT = 'ca.cert';

// HTTPS Serveri seadistus
config.HTTPS_PORT = 5000; // HTTPS Serveri port
config.HTTPS_KEY = 'https.key'; // HTTPS privaatvõtme failinimi
config.HTTPS_CERT = 'https.cert'; // HTTPS serdi failinimi

// TCP-TLS Serveri seadistus 
config.TCP_TLS_PORT = 5001; // TCP (TLS) Serveri port
config.TCP_TLS_KEY = 'tcp-tls.key'; // TCP-TLS privaatvõtme failinimi
config.TCP_TLS_CERT = 'tcp-tls.cert'; // TCP-TLS serdi failinimi

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