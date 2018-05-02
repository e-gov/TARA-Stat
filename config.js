/**
 * Konfiguratsioonifail
 * 
 * Vt https://stackoverflow.com/questions/5869216/how-to-store-node-js-deployment-settings-configuration-files
 */

var config = {};

/* HTTPS Serveri port*/
config.port = process.env.PORT || 443;

/* HTTPS privaatvõti ja sert */

/**
 * Windows-le
 * Oluline: Backslash escape \\
 */
config.key = "keys\\tara-stat.key";
config.cert = 'keys\\tara-stat.cert';

/* Linux-is:
config.key = './keys/tara-stat.key';
config.cert = './keys/tara-stat.cert';
*/

/* Andmebaasi nimi */
config.logibaas = 'logibaas';
/* Collection-i (andmetabeli) nimi */
config.collection = 'autentimised';

/* MongoDB URL */
config.mongodb_url = 'mongodb://localhost:27017';

/* Kasutajakonto MongoDB-s */
config.mongouser = 'rakendus';
config.mongouserpwd = process.env.MONGOUSERPWD || 'changeit';

/* TARA-Serveri nimi ja salasõna (API võti) */
config.taraserver = 'taraserver';
config.taraserverpwd = process.env.TARASERVERPWD || 'changeit';

module.exports = config;