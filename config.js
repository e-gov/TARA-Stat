/**
 * --------------------------------------------------------------------
 *   TARA-STAT veebirakenduse konfiguratsioonifail config.js
 * 
 * Vt https://stackoverflow.com/questions/5869216/how-to-store-node-js-deployment-settings-configuration-files
 */

var config = {};

/* Logifaili asukoht */
config.logifail = process.env.LOGIFAIL || '/opt/TARA-Stat/log.txt';

/* HTTPS Serveri port*/
config.port = process.env.PORT || 5000;

/**
 * HTTPS privaatvõtme ja serdi failinimed (self-signed serdi puhul)
 */
config.selfsigned = false;
config.key = 'tara-stat.key';
config.cert = 'tara-stat.cert';

/**
 * pfx-faili nimi (organisatsiooni CA puhul)
 */
config.pfx = 'certificate.pfx';

/* Andmebaasi nimi */
config.logibaas = 'logibaas';
/* Collection-i (andmetabeli) nimi */
config.collection = 'autentimised';
/* Elusolekukontrolli abitabel */
config.heartbeathelpertable = 'elutukse';

/* MongoDB URL */
config.mongodb_url = 'mongodb://localhost:27017';

/* Kasutajakonto MongoDB-s */
config.mongouser = 'rakendus';
config.mongouserpwd = process.env.MONGOUSERPWD || 'MONGOUSERPWD-changeit';

/* Logikirje lisamise API võti */
config.tarastatuser = 'tara-server';
config.tarastatsecret = process.env.TARASTATSECRET || 'TARASTATSECRET-changeit';

module.exports = config;

/**
 * --------------------------------------------------------------------
 *   konfiguratsioonifaili config.js LÕPP
 * 
 */ 
