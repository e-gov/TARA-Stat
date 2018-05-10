/**
 * Makettrakenduse mockup.js konfiguratsioonifail
 */

var config = {};

/* TARA-Stat logikirje lisamise otspunkti URL */
config.TARASTATURL = process.env.TARASTATURL || 'https://localhost:5000';

/* Logikirje lisamise API võti */
config.TARASTATUSER = process.env.TARASTATUSER || 'changeit';
config.TARASTATSECRET = process.env.TARASTATSECRET || 'changeit';

module.exports = config;