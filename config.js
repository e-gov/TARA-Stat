/** ---------------------------------------------------------------
 *   TARA-STAT veebirakenduse konfiguratsioonifail config.js
 */

var config = {};

// Logifaili asukoht
config.LOGIFAIL = '/opt/TARA-Stat/log.txt';

// CA sert
config.CA_CERT = 'ca.cert';

// TARA-Stat kasutusstatistika väljastamise HTTPS Serveri seadistus
config.HTTPS_PORT = 5000; // HTTPS Serveri port
config.HTTPS_KEY = 'https-server.key'; // HTTPS privaatvõtme failinimi
config.HTTPS_CERT = 'https-server.cert'; // HTTPS serdi failinimi

// TARA-Stat logikirjete saatmise TCP-TLS ühenduse seadistus 
config.TCP_TLS_PORT = 5001; // TCP-TLS Serveri port
config.TCP_TLS_KEY = 'TARA-STAT-TLS-PARTY-SELF.key'; // TCP-TLS osapoole privaatvõtme failinimi
config.TCP_TLS_CERT = 'TARA-STAT-TLS-PARTY-SELF.cert'; // TCP-TLS osapoole serdi failinimi

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