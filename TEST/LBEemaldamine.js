/**
 * Eemaldan mustri järgi kirjed logibaasist
 * Käivitada:
 * 
 *   mongo --quiet LBEemaldamine.js
 */

'use strict';

print('Eemaldan kirjed logibaasist mustri järgi');

var conn = new Mongo();
var db = conn.getDB("logibaas");

var p = '^2018-05';
print('Muster: ' + p);

var r = new RegExp(p);

var c = db.autentimised.countDocuments({});
print('Kirjeid: ' + c.toString());

var op = db.autentimised.deleteMany(
  {
    time: { $regex: r }
  }
);

print(
  'Kustutati ' +
  op.deletedCount.toString() +
  ' dokumenti'
);

c = db.autentimised.countDocuments({});
print('Kirjeid pärast kustutamist: ' + c.toString());

db.autentimised.find({}).pretty();