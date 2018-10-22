/** ---------------------------------------------------------------
 *   TARA-STAT veebirakenduse konfiguratsioonifail config.js
 */

var config = {};

// Logifaili asukoht
config.LOGIFAIL = '/opt/TARA-Stat/log.txt';

// TCP Serveri port (TLS-ta; kuulub eemaldamisele)
config.TCP_PORT = 5001;

/**
 * HTTPS Serveri seadistus
 */ 
// HTTPS Serveri port
config.HTTPS_PORT = 5000; 

// Kas HTTPS self-signed sert?
config.HTTPS_SELFSIGNED = true;

// HTTPS privaatvõtme failinimi
config.HTTPS_KEY = 'tara-stat-https.key';

// HTTPS serdi failinimi
config.HTTPS_CERT = 'tara-stat-https.cert';

// HTTPS pfx-faili nimi (organisatsiooni CA puhul)
config.HTTPS_PFX = 'https-certificate.pfx';

/**
 * TCP-TLS Serveri seadistus
 */ 
// TCP (TLS) Serveri port
config.TCP_TLS_Port = 5002;

// Kas TCP-TLS self-signed sert?
config.TCP_TLS_SELFSIGNED = true;

// TCP-TLS privaatvõtme failinimi
config.TCP_TLS_KEY = 'tara-stat-tcp-tls.key';

// TCP-TLS serdi failinimi
config.TCP_TLS_CERT = 'tara-stat-tcp-tls.cert';

// TCP-TLS pfx-faili nimi (organisatsiooni CA puhul)
config.TCP_TLS_PFX = 'tcp-tls-certificate.pfx';

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