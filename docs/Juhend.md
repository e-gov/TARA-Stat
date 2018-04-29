---
permalink: Mikroteenus
---
---
permalink: Juhend
---

[EJS Syntax Reference](https://github.com/mde/ejs/blob/master/docs/syntax.md)

Elusolekupäring

`/status` - vastab `TARA-Stat: OK`

### Veateated

ERR-01: Logibaasiga ühendumine ebaõnnestus<br>
ERR-02: Viga logibaasist lugemisel


- loetle v kirjelda arendussõltuvused (-eeldused)
- loetle v kirjelda toodangusõltuvused




##MongoDB
- [paigaldusjuhend Windows-le](https://docs.mongodb.com/master/tutorial/install-mongodb-on-windows/)
- käivitamine (Windows): `"C:\Program Files\MongoDB\Server\3.6\bin\mongod.exe"`
- pääsuhaldus
  - [Enable Auth](https://docs.mongodb.com/manual/tutorial/enable-authentication/)

### MongoDB Compass
- [juhend](https://docs.mongodb.com/compass/current/)

### mongo
- "an interactive JavaScript shell interface to MongoDB"
- [ülevaade](https://docs.mongodb.com/manual/mongo/)
- [Reference](https://docs.mongodb.com/manual/reference/program/mongo/#bin.mongo)
- käivitamine: `mongo`

### MongoDB server
- käivitamine: `mongod`
- käivitamisel vaikimisi(?) seotakse localhost-ga. S.t väljast tulevaid pöördumisi ei teeninda. Välispöördumiste teenindamiseks käivitada `--bind_ip <address>` või `--bind_ip_all`.
- vaikimisi teenindab pordil `27017`.
- konsoolile logib ühendusi.

MongoDB suhtleb välisilmaga ainult RESTHeart-i vahendusel.
RESTHeart ja MongoDB vaheline liides kaitstakse MongoDB standardse pääsumehhanismiga - [Salted Challenge Response Authentication Mechanism](https://docs.mongodb.com/manual/core/authentication-mechanisms/).
[Pääsu seadmise juhend](https://docs.mongodb.com/manual/tutorial/enable-authentication/) (MongoDB)


Rakendus suhtleb MongoDB-ga TCP/IP socket-i põhise [MongoDB wire protocol](https://docs.mongodb.com/manual/reference/mongodb-wire-protocol/)-iga.

## MongoDB Node.JS Driver 
- [ülevaade](http://mongodb.github.io/node-mongodb-native/?jmp=docs&_ga=2.138292915.2088530382.1524857109-302204577.1524857109)
- [dok-n](http://mongodb.github.io/node-mongodb-native/3.0/)


## Logibaas

- MongoDB andmebaas: `logibaas`
- collection: `autentimises`

[Aggregation Pipeline](https://docs.mongodb.com/manual/core/aggregation-pipeline/)

[Using the Aggregation Framework](http://mongodb.github.io/node-mongodb-native/2.0/tutorials/aggregation/)



