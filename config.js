/**
 * Konfiguratsioonifail
 * 
 * Vt https://stackoverflow.com/questions/5869216/how-to-store-node-js-deployment-settings-configuration-files
 */

var config = {};

/* HTTPS Serveri port*/
config.port = process.env.PORT || 5000;

/**
 * HTTPS privaatvõtme ja serdi failide asukohad
 * Kommenteeri mittevajalik välja (Windows v Ubuntu)
 */

/**
 * Windows
 * Oluline: Backslash escape \\
 */
config.key = "keys\\tara-stat.key";
config.cert = 'keys\\tara-stat.cert';

/* Ubuntu */
// config.key = '/home/priit/TARA-Stat/keys/tara-stat.key';
// config.cert = '/home/priit/TARA-Stat/keys/tara-stat.cert';

/* Andmebaasi nimi */
config.logibaas = 'logibaas';
/* Collection-i (andmetabeli) nimi */
config.collection = 'autentimised';

/* MongoDB URL */
config.mongodb_url = 'mongodb://localhost:27017';

/* Kasutajakonto MongoDB-s */
config.mongouser = 'rakendus';
config.mongouserpwd = process.env.MONGOUSERPWD || 'changeit';

/* Logikirje lisamise API võti */
config.tarastatuser = 'APIUSER-changeit';
config.tarastatsecret = process.env.TARASTATSECRET || 'APIKEY-changeit';

module.exports = config;