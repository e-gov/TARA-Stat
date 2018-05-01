/**
 * Konfiguratsioonifail
 * 
 * Vt https://stackoverflow.com/questions/5869216/how-to-store-node-js-deployment-settings-configuration-files
 */

var config = {};

/* HTTPS Serveri port*/
config.port = process.env.PORT || 443;
/* HTTPS privaatvõti */
config.key = './keys/tara-stat.key';
/* HTTPS sert */
config.cert = './keys/tara-stat.cert';

/* Andmebaasi nimi */
config.logibaas = 'logibaas';
/* Collection-i (andmetabeli) nimi */
config.collection = 'autentimised';

/* MongoDB URL */
config.mongodb_url = 'mongodb://localhost:27017';