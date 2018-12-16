/**
 * Eemaldan mustri järgi kirjed logibaasist
 * Käivitada mongo abil.
 */

'use strict';

var p = '^2018';

r = new RegExp(p);

var conn = new Mongo();
var db = conn.getDB("Logibaas");
db.logibaas.deleteMany(
  {
    $match: {
      time: { $regex: r }
    }
  }
);