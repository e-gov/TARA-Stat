/** ---------------------------------------------------------------
 *   TARA-STAT veebirakenduse konfiguratsioonifail config.js
 */

var config = {};

/* Logifaili asukoht */
config.logifail = process.env.LOGIFAIL || '/opt/TARA-Stat/log.txt';

config.port = process.env.PORT || 5000; /* HTTPS Serveri port*/

config.selfsigned = false; /* Kas self-signed sert? */
config.key = 'tara-stat.key'; /* HTTPS privaatvõtme failinimi */
config.cert = 'tara-stat.cert'; /* HTTPS serdi failinimi */

config.pfx = 'certificate.pfx'; /* pfx-faili nimi (organisatsiooni CA puhul) */


config.logibaas = 'logibaas'; /* Andmebaasi nimi */
config.collection = 'autentimised'; /* Collection-i (andmetabeli) nimi */
config.heartbeathelpertable = 'elutukse'; /* Elusolekukontrolli abitabel */

config.mongodb_url = 'mongodb://localhost:27017'; /* MongoDB URL */

/* Kasutajakonto MongoDB-s */
config.mongouser = 'rakendus';
config.mongouserpwd = process.env.MONGOUSERPWD || 'MONGOUSERPWD-changeit';

/* Logikirje lisamise API võti */
config.tarastatuser = 'tara-server';
config.tarastatsecret = process.env.TARASTATSECRET || 'TARASTATSECRET-changeit';

module.exports = config;

/**
 * Vt https://stackoverflow.com/questions/5869216/
 * how-to-store-node-js-deployment-settings-configuration-files
 * --------------------------------------------------------------------
 */ 
