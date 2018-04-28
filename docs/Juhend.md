---
permalink: Juhend
---

[EJS Syntax Reference](https://github.com/mde/ejs/blob/master/docs/syntax.md)


Elusolekupäring

`/status` - vastab `TARA-Stat: OK`

### Veateated

ERR-01: Logibaasiga ühendumine ebaõnnestus


---
permalink: Mikroteenus
---

- loetle v kirjelda arendussõltuvused (-eeldused)
- loetle v kirjelda toodangusõltuvused


## Vahendid

[httpie](https://httpie.org/) - HTTP käsureaklient.
- kasulik REST API-de uurimisel ja silumisel. Väidetavalt parem kui curl.
- eeldab: Python.
- käivimine: CLI-s http
- [dok-n](https://httpie.org/doc)

[RESTHEart](http://restheart.org/) - MongoDB veebiliides
- rakendus, mis ühendub MongoDB külge ja võimaldab REST API kaudu andmebaasi kasutada
- GNU Affero General Public License v3.0
- suhteliselt populaarne - [GitHub](https://github.com/softinstigate/restheart); dok-n enam-vähem
- sisaldab lihtsat UI-d (HAL Browser)
  - lokaalsesse masinasse paigaldamisel `http://127.0.0.1:8080/browser/`´
- endpoint lokaalses masinas: `localhost:8080` v `http://127.0.0.1:8080/`
- eeldab:
  - Java 8+ (kontrolli: `java -version`)
  - MongoDB (kontrolli: `mongod --version`)
- [paigaldusjuhend](http://restheart.org/learn/setup/#manual-installation-and-configuration) (käsitsi, mitte Docker-ga)
- [turvalisus: kliendi ühendamine RESTHeart-ga](http://restheart.org/learn/security/)

[MongoDB]()
- [paigaldusjuhend Windows-le](https://docs.mongodb.com/master/tutorial/install-mongodb-on-windows/)
- käivitamine (Windows): `"C:\Program Files\MongoDB\Server\3.6\bin\mongod.exe"`
- pääsuhaldus
  - [Enable Auth](https://docs.mongodb.com/manual/tutorial/enable-authentication/)

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

[MongoDB Node.JS Driver](http://mongodb.github.io/node-mongodb-native/?jmp=docs&_ga=2.138292915.2088530382.1524857109-302204577.1524857109)
- [dok-n](http://mongodb.github.io/node-mongodb-native/3.0/)






