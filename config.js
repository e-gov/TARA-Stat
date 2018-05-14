/**
 * Konfiguratsioonifail
 * 
 * Vt https://stackoverflow.com/questions/5869216/how-to-store-node-js-deployment-settings-configuration-files
 */

var config = {};

/* HTTPS Serveri port*/
config.port = process.env.PORT || 5000;

/**
 * HTTPS privaatvõtme ja serdi failide nimed
 * failid peavad olema kaustas TARA-Stat/keys
 */
config.key = 'tara-stat.key';
config.cert = 'tara-stat.cert';

/* Andmebaasi nimi */
config.logibaas = 'logibaas';
/* Collection-i (andmetabeli) nimi */
config.collection = 'autentimised';

/* MongoDB URL */
config.mongodb_url = 'mongodb://localhost:27017';

/* Kasutajakonto MongoDB-s */
config.mongouser = 'rakendus';
config.mongouserpwd = process.env.MONGOUSERPWD || 'MONGOUSERPWD-changeit';

/* Logikirje lisamise API võti */
config.tarastatuser = 'tara-server';
config.tarastatsecret = process.env.TARASTATSECRET || 'APIKEY-changeit';

module.exports = config;