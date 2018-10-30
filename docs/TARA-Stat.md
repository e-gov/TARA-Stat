---
permalink: Dokumentatsioon
layout: TARA
---

# TARA-Stat. Kasutusjuhend
{: .no_toc}

## Sisukord
{: .no_toc}

- TOC
{:toc}

## 1 Ülevaade

TARA-Stat on mikroteenus [autentimisteenuse TARA](https://e-gov.github.io/TARA-Doku) kasutusstatistika tootmiseks ja vaatamiseks. 

Käesolev dokument esitab tarkvara kirjelduse ja juhised tarkvara paigaldamiseks, hooldamiseks ja kasutamiseks. 

Dokument on mõeldud TARA-Stat paigaldajale, käitajale ja kasutajale.

TARA-Stat-i on arendanud Riigi Infosüsteemi Amet.

Märkus. Eraldi _write-up_ mikroteenusarhitektuurist on siin: [https://e-gov.github.io/TARA-Stat/](https://e-gov.github.io/TARA-Stat/).

Tähistused:

| tähistus | tähendus |
|----------|----------|
| <tara-stat> | TARA-STAT masina domeeninimi |
| <tara-stat-https-port> | TARA-STAT veebirakenduse HTTPS serveri pordinumber |
| <tara-stat-tls-port> | TARA-STAT veebirakenduse Syslog TCP TLS serveri pordinumber |

_Kõik viited salasõnadele ja tundlikele taristuparameetritele (nt hostinimed, pordid, kasutajanimed) on dokumendis illustratiivsed ja kuuluvad toodangupaigalduses ümbervaatamisele, salasõnade osas aga kindlasti asendamisega turvalistega._

## 1 Tarkvara kirjeldus

### 1.1 Ülevaade

TARA-Stat pakub:

- võimalust autentimisteenuses fikseeritud autentimistoimingute logimiseks
- võimalust logi põhjal lihtsa, kuid autentimisteenuse haldamiseks vajaliku statistika arvutamiseks ja vaatamiseks. Eelkõige huvitab autentimiste arv klientrakenduste lõikes ajaperioodil.

Üldistatud arhitektuurijoonis:

<p style='text-align:center;'><img src='img/Arhi.PNG' width= "500"></p>

TARA-Stat kasutajaliides statistikakasutajale:

<p style='text-align:center;'><img src='img/Capture.PNG' width= "500" style='border: 1px solid black;'></p>

TARA-Stat koosneb kahest komponendist:

| komponent | tehniline nimi | otstarve |
|-----------|----------------|----------|
| veebirakendus | `tarastat` | Node.js rakendus, mis ühelt poolt võtab vastu logikirjed ja salvestab need logibaasi. Teiselt poolt arvutab kasutusstatistika ja esitab seda statistikakasutajale. Koosneb omakorda serveripoolsest osast ja  kasutaja sirvikusse laetavast osast |
| logibaas | `mongodb` | MongoDB andmebaas, kuhu salvestatakse logikirjeid |

Komponente käitatakse ühes masinas, Linux-i teenustena.

TARA-Stat-l on neli liidest:

| liides    | URL või nimi  | otstarve |
|-----------|:----:|----------|
| logikirje lisamise liides (otspunkt) | `<tara-stat>:<tara-stat-tls-port>` | TCP otspunkt, mille kaudu TARA-Stat võtab TARA-Server-lt vastu logikirjeid |
| statistika väljastamise  (otspunkt) | `https://<tara-stat>/stat:<tara-stat-https-port>` | HTTPS veebiliides, mille kaudu statistikakasutaja tutvub kasutusstatistikaga |
| logibaasi haldamise liides | `mongo` | MongoDB käsureaklient, millega aeg-ajalt puhastatakse logibaasi aegunud kirjetest |
| elutukse liides | `https://<tara-stat>/status:<tara-stat-https-port>` | HTTPS otspunkt, millelt saab pärida kinnitust TARA-Stat elusoleku kohta |

TARA-Stat suhtleb 5 välise osapoolega.

| väline osapool | selgitus |
|----------------|----------|
| statistikakasutaja | autentimisteenust TARA käitava organisatsiooni teenistuja - teenusehaldur või tootejuht- kes vajab teavet teenuse kasutamise mahu, sh trendide kohta. Statistikakasutajale tuleb pakkuda statistikat. Eriti vajalik on teave teenuse tarbimismahtudest klientrakenduste lõikes. Statistikakasutajal peab olema võimalik ette anda periood, mille kohta statistika arvutatakse. Statistikakasutajal ei tohi olla võimalust logi muuta.<br><br>Kuna statistika on üldistatud ega sisalda isikuandmeid, lähtume statistika otspunkti turvamisel, et otspunkt on avatud organisatsiooni sisevõrgus, kõigile töötajatele. |
| TARA-Server | saadab TARA-Stat-i logikirjeid. TARA-Server võib olla paigaldatud mitmes instantsis. |
| andmehaldur | inimene, kes, kasutades MongoDB standardvahendit - käsurealiidest `mongo` - kustutab logibaasist aegunud kirjeid. (Kasutusstatistika pakub huvi u aasta jooksul). See on harv tegevus. |
| admin | inimene, kes paigaldab tarkvara, loob andmebaasi kasutajatele (TARA-Server, andmehaldur) kontod ja annab pääsuõigused. |
| monitooringusüsteem | saab TARA-Stat-le saata "elutuksepäringu". TARA-Stat vastab, kas ta toimib. |

### 1.2 Logikirje lisamise otspunkt

Logikirje lisamise otspunkt võtab TARA-Serverilt vastu [Syslog](https://tools.ietf.org/html/rfc5424) vormingus kirjeid autentimissündmuste kohta. Logikirje tuum on JSON-vormingus.

Kirje:
- tuleb saata `TCP` protokolliga URL-ile `<tara-stat>:<tara-stat-tls-port>`, kus `<tara-stat>` on TARA-Stat-i domeeninimi
- peab lõppema tärgiga `newline` (`0x0a0`) 
- Syslog-kirje sõnumiosa (MSG) peab olema vormistatud JSON dokumendina:

1) autentimise alguse sündmuse logimisel:

```
{
  "time" : "<kuupäeva formaat>",
  "clientId" : "openIdDemo",
  "method" : "banklink",
  "bank" : "SEB",
  "operation" : "START_AUTH"
}
```

2) autentimise eduka lõpu logimisel:

```
{
  "time" : "<kuupäeva formaat>",
  "clientId" : "openIdDemo",
  "method" : "banklink",
  "bank" : "SEB",
  "operation" : "SUCCESSFUL_AUTH"
}
```

3) autentimise ebaeduka lõpu logimisel:

```
{
  "time" : "<kuupäeva formaat>",
  "clientId" : "openIdDemo",
  "method" : "banklink",
  "bank" : "SEB",
  "operation" : "ERROR",
  "error" : "INTERNAL_ERROR",
}
```

- `time`, `clientId`, `method` ja `operation` peavad saadetavas päringus olema alati. `bank` on kohustuslik ainult juhul kui tegemist on pangalingi kirjega (`method` väärtus on `banklink` ). Kui mõni neist on puudu, siis tagastab TARA-Stat veateate `Valesti moodustatud logikirje`. Element `error` ei ole kohustuslik; see lisatakse TARA-Stat-i ainult siis, kui `operation` väärtus on `ERROR`.

TARA-Stat võtab saadetud kirjest olulised väljad, moodustab nendest logikirje ja salvestab logibaasi (MongoDB).

Logibaasi salvestatakse kirje vormingus:

```
{
  "time": "<ISO 8601 kuupäev>",
  "clientID": "<klientrakenduse nimi>",
  "method": "<autentimismeetod>",
  "bank": "<panga kood>",
  "operation": "<sündmuse koodnimetus>",
  "error": "<veateade>"
}
```

kus:
- `ISO 8601 kuupäev` on ajatempel kujul `2018-04-28`, millele võib järgneda kellaaja osa
- klientrakenduse nimi on TARA-s registreeritud klientrakenduse nimi
- autentimismeetod peab olema vastavalt TARA [tehnilises kirjelduses](https://e-gov.github.io/TARA-Doku/TehnilineKirjeldus#43-identsust%C3%B5endip%C3%A4ring) määratule.
- panga kood on pangalingiga autentimise puhul panga lühinimetus (läbivalt suurte tähtedega)
- sündmuse koodnimetus peab olema vastavalt TARA [kasutusstatistika spetsifikatsioonile](https://e-gov.github.io/TARA-Doku/Statistika):
  - `START_AUTH` - autentimine alanud
  - `SUCCESSFUL_AUTH` - autentimise edukas lõpp
  - `ERROR` - autentimise ebaedukas lõpp
- veateade lisatakse ainult siis, kui see päringus saadeti (`operation` väärtus `ERROR`).

### 1.3 Statistika väljastamise otspunkt

Statistika väljastamise otspunkti e statistikakasutaja UI kaudu saab kasutaja tutvuda TARA kasutusstatistikaga.

- avada sirvikus leht `https://<tara-stat>/stat:<tara-stat-https-port>`
- määrata periood (võib jääda ka tühjaks)
  - sisestades regulaaravaldise
  - nt `2018-04` valib 2018. a aprilli logikirjed
- vajutada nupule
- kuvatakse autentimiste arv perioodi jooksul klientrakenduste lõikes.

### 1.4 Võtmed ja salasõnad

TARA-Stat paigaldamiseks ja käitamiseks on vaja järgmisi võtmeid ja salasõnu (saladusi):

| nr | kasutaja vm õiguste subjekt (_principal_) | selgitus | kredentsiaali(de) tüüp | kus määratakse või kuhu paigaldatakse | kus kasutatakse |
|:--:|:--------:|--------:|:--------------:|----|----|
| 1 | `admin` | Ubuntu kasutaja, kes paigaldab tarkvara ja teeb muid haldustoiminguid | salasõna | määratakse VM op-süsteemi paigaldamisel | adminitoimigutes VM-is | 
| 2 | `tarastat` | Ubuntu kasutaja, kelle alt käivitatakse TARA-Stat veebirakendus | salasõna | TARA-Stat veebirakenduse seadistamisel | TARA-Stat veebirakenduse käitamisel |
| 3 | `mongodb` | Ubuntu kasutaja, kelle alt käitatakse MongoDB andmebaas | salasõna | MongoDB paigaldamisel | MongoDB käitamisel |
| 4 | `userAdmin` | MongoDB kasutaja, kes haldab MongoDB kasutajaid. Seda rolli täidab VM admin | salasõna | MongoDB paigaldamisel | MongoDB kasutajakontode haldamisel |
| 5 | `rakendus` | TARA-Stat veebirakenduse konto MongoDB-s | salasõna | määratakse MongoDB paigaldamisel, kantakse ka TARA-Stat veebirakenduse konf-i | TARA-Stat-i poolt pöördumisel MongoDB poole |
| 6 | `andmehaldur` | MongoDB konto, mille alt kustutatakse aegunud logikirjeid. Andmehalduri rolli täidab VM admin | salasõna | MongoDB paigaldamisel | MongoDB logibaasi haldamisel |
| 7 | `https://<tara-stat>` | TARA-Stat veebirakendus HTTPS serverina | organisatsiooni CA poolt väljaantud või _self-signed_ sert ja privaatvõti | TARA-Stat veebirakenduse seadistamisel | Sirviku pöördumisel TARA-Stat-i poole |
| 8 | `TARA-Stat TCP TLS server` | TARA-Stat veebirakendus TCP TLS serverina | _self-signed_ sert ja privaatvõti | TARA-Stat veebirakenduse seadistamisel | TARA-Serveri pöördumisel TARA-Stat-i poole |

Statistikakasutaja on TARA-Stat-i suhtes anonüümne inimene. Ta pöördub sisevõrgust TARA-Stat veebirakenduse statistika väljastamise otspunkti poole. Statistikakasutajat ei autendita, juurdepääs piiratakse kontekstiga.

Repos olevates konf-ifailides on saladused esitatud väärtustega `changeit`. Toodangupaigalduses tuleb väärtused `changeit` asendada. Paigaldusskriptides küsitakse uusi väärtusi.

### 1.5 Olulised asukohad

| repo, kaust v fail | otstarve     |
|--------------|--------------|
| `https://github.com/e-gov/TARA-Stat` | avalik koodirepo |
| `index.js`   | veebirakendus |
| `scripts`    | paigaldusskriptid |
| `docs`       | dokumentatsioon |
| `/opt/tara-ci-config/TARA-Stat` | TARA-Stat seadistus |
| `/opt/tara-ci-config/TARA-Stat/keys` | TARA-Stat võtmed |
| `/opt/TARA-Stat/log.txt` | TARA-Stat veebirakenduse logi |
| `/lib/systemd/system/tarastat.service` | TARA-Stat veebirakenduse systemd haldusüksuse kirjeldusfail |
| `/etc/mongodb.conf` | MongoDB konf-ifail |
| `/var/log/mongodb/mongod.log` | MongoDB logi |
| `var/lib/mongodb` | MongoDB andmebaasifailid |
| `/var/log/mongodb/mongod.log` | MongoDB andmebaasilogi |
| `/lib/systemd/system/mongod.service` | MongoDB systemd haldusüksuse kirjeldusfail |
| `/etc/init.d/mongodb` | automaatkäivitusskript |
| `/opt/TARA-Stat/log.txt` | veebirakenduse logi. Logifaili asukoht on veebirakenduse konf-ifailis seatav. |

### 1.6 Sõltuvused

Tootmissõltuvused:

| sõltuvus | versioon | selgitus, sh milleks vajalik |
|----------|----------|-----------------|
| backend: | | |
| Ubuntu   | 16 LTS   | suure tõenäosusega sobib ka hilisem |
| Node.js  | 6.x      | veebirakenduse platvorm |
| body-parser | standardne | HTTP päringu parsimisvahend, kasutusel veebirakenduses |
| ejs         | standardne | templiidimootor, kasutusel veebirakendus |
| express | standardne | HTTP päringute marsruuter, kasutusel veebirakendus |
| rwlock | standardne | lukuhalduri teek, kasutusel veebirakenduses |
| mongodb | standardne | MongoDB klient, kasutusel veebirakenduses |
| MongoDB  | 3.6.4 | logibaas |
| frontend: | | |
| HTML5, Css3, Javascript | | |
| jQuery | | |
| Material Design ikoonid | | |

Arendussõltuvused:

| sõltuvus | versioon | selgitus, sh milleks vajalik |
|----------|----------|-----------------|
| GitHub | | avalik koodirepo |
| Jekyll | | avaliku dok-ni publitseerimine |

Märkus. "Standardne" tähendab laialt kasutatavat, stabiilset teeki, millest `npm` abil paigaldatakse viimane versioon. Kui versioon on tühi, siis kasutatakse standardseid võimalusi, mis ei nõua sidumist konkreetse versiooniga.

### 1.7 Konfigureerimine (ülevaade)

Konfigureeritakse järgmiste failidega:

| fail        | eesmärk ja kasutamine |
|-------------|-----------------------|
| `/opt/TARA-Stat/config.js` | veebirakenduse konf-n. |
| `/etc/mongodb.conf`        | MongoDB konf-n. Kasutatakse MongoDB distributsiooni vaikimisi konf-i. Käsitsi konf-mine on vajalik siis, kui tahetakse muuta tundlike taristuparameetrite vaikeväärtusi (nt porti). |

Konfiguratsiooni osaks on ka võtmed ja kasutajakontod.

## 2 Paigaldamine ja seadistamine

### 2.1 Ülevaade

TARA-Stat paigaldatakse ühes instantsis, ühte masinasse. _Kõrgkäideldavus ei ole TARA-Stat praeguses teostuses eesmärk. Tõrke korral tekib küll statistikas auk, kuid ärivajaduse rahuldamiseks on aktsepteeritav ka mõneti lünklik statistika._

Koodi ja seadistust hoitakse eraldi repodes.

| repo nimi | eesmärk | avalik
|------|---------|---------
| https://e-gov.github.io/TARA-Stat | rakenduse kood | jah
| tara-ci-config | rakenduse seadistus | ei

Paigaldustoimingud:

| nr | toimingu nimetus/eesmärk  | eeldused | skript või käsitsipaigaldamise juhis | tulemus |
|----|------------------|----------|--------------------------------------|---------|
| 1  | Masina ettevalmistamine | - |                                      | virtuaalmasin on loodud; Ubuntu 16 LTS on paigaldatud |
| 2  | Paigalda koodirepo (või uuenda seda) | 1      | vt allpool                           | TARA-Stat kood on masinas kaustas `/opt/TARA-Stat` |
| 3  | Paigalda (või uuenda) Node.js   | 1      | vt allpool | Node.js on masinas paigaldatud (või uuendatud) |
| 4  | Paigalda (või uuenda) MongoDB  | 1 | vt allpool | MongoDB on masinas paigaldatud (või uuendatud) ja teenusena käivitatud |
| 5  | Paigalda konf-ifail ja võtmed | 2, 3 | vt allpool | Konf-ifail ja võtmed on masinas kaustas `/opt/tara-ci-config/TARA-Stat` |
| 6  | Seadista TARA-Stat veebirakendus | 2, 3, 5 | vt allpool | TARA-Stat veebirakendus on seadistatud ja teenusena käivitatud |

### 2.2 Paigalda koodirepo

Eeldused:
- virtuaalmasin (VM) on loodud
- Ubuntu 16 LTS on paigaldatud
- paigaldaja (admin) on sudo-õigustega kasutajana sisse loginud

Paigalda koodirepo. Siin juhendis eeldame, et TARA-Stat kood asub GitHub-is, kuid võib olla ka siserepos.

````
sudo rm -R /opt/TARA-Stat # kustuta vana kood (valikuline)
cd /opt
sudo git clone https://github.com/e-gov/TARA-Stat
````

Kontrolli, et TARA-Stat kood kopeeriti kausta `/opt/TARA-Stat`.

Koodiuuenduse paigaldamisel seiska kõigepealt veebirakendus (juhul kui see käib). Seejärel tõmba uuendused koodirepost.

`sudo systemctl stop tarastat`
`cd /opt/TARA-Stat`
`sudo git pull`

Koodi uuendamisel on vaja veebirakendus uuesti seadistada.

### 2.3 Paigalda Node.js

Eeldused:
- virtuaalmasin (VM) on loodud
- Ubuntu 16 LTS on paigaldatud
- paigaldaja (admin) on sudo-õigustega kasutajana sisse loginud

Käivita skript:

`TARA-Stat-paigalda-Nodejs.sh`

Skript: 1) kontrollib, kas Node.js on juba paigaldatud; kui jah, siis annab teate paigaldajale ja töö lõpp; 2) paigaldab curl-i; 3) paigaldab Node.js

Skripti sõltuvused: `https://deb.nodesource.com/setup_6.x`

### 2.4 Paigalda MongoDB

Eeldused:
- virtuaalmasin (VM) on loodud
- Ubuntu 16 LTS on paigaldatud
- paigaldaja (admin) on sudo-õigustega kasutajana sisse loginud

Käivita skript:

`TARA-Stat-paigalda-MongoDB.sh`

Skripti sõltuvused:
- `hkp://keyserver.ubuntu.com:80`
- `https://repo.mongodb.org/apt/ubuntu`
- kasutaja `mongodb` parool
- MongoDB kasutajate `userAdmin`, `rakendus` ja `andmehaldur` paroolid

### 2.5 Paigalda konf-ifail ja võtmed

Valmista konf-ifail ja võtmed ette konfiguratsioonirepos (mitteavalik). Seejärel klooni repo masinasse:

`cd /opt`
`sudo git clone <konf-irepo>`

### 2.6 Seadista veebirakendus

Eeldused:
- Node.js on paigaldatud
- MongoDB on paigaldatud
- masinasse on loodud koodirepo `https://github.com/e-gov/TARA-Stat` kohalik git-koopia ja see on värske
- konf-irepo on kopeeritud masinasse, kausta `/opt/tara-ci-config`.

Käivita skript:

`sudo bash /opt/TARA-Stat/scripts/Seadista.sh`:

Skript teeb:
1. Loon Node.js käitluskasutaja (run user)
2. Paigaldan rakendusele vajalikud Node.js teegid
4. Paigaldan MongoDB kasutamise salasõna
5. Annan tarastat-le õigused kodukaustale (TARA-Stat)
6. Loon systemd haldusüksuse kirjeldusfaili
7. Laen deemoni
8. (valikuline) Käivitan veebirakenduse (koos logibaasiga)

Skripti sõltuvused:
- kasutaja `tarastat` parool
- Node.js teegirepo (sisemine või `https://registry.npmjs.org/`)
- Node.js teegid: `body-parser`, `ejs`, `express`, `mongodb`, `request`, `basic-auth`, `request-debug`
- MongoDB kasutamise salasõna
- logikirje lisamise otspunkti API-võti.

### 2.7 VM tulemüüri seadistamine

Vaja on tagada:

- TARA-Server-lt tulevate TCP TLS päringute teenindamine
- statistikakasutajalt (pöördub sirvikuga) tulevate HTTPS päringute (sh AJAX) teenindamine
- monitooringulahenduselt (kui kasutatakse) tulevate HTTPS päringute teenindamine.

TARA-Stat kuulab HTTPS ühendusi pordil <tara-stat-https-port> ja Syslog TCP ühendusi pordil <tara-stat-tls-port>. Need pordid on määratud failis `config.js`.

Vajadusel vt:
- [How to Install MongoDB on Ubuntu 16.04](https://www.digitalocean.com/community/tutorials/how-to-install-mongodb-on-ubuntu-16-04), Step 3.

Pääsureeglite seadmisel VLAN-is ja/või sisevõrgu ruuteri(te)s, samuti TARA-Serveris lähtu organisatsiooni võrgureeglitest.

### 2.8 Käivitamine ja seiskamine

Nii TARA-Stat veebirakendus kui ka MongoDB käitatakse systemd hallatavate teenustena. 

|    | TARA-Stat veebiteenus | MongoDB (logibaas) |
|----|:---------------------:|:------------------:|
| systemd teenusenimi | `tarastat` |  `mongodb`  |
| käitav Ubuntu kasutaja | `tarastat` | `mongodb` |

Teenused käivitatakse ja seisatakse standardsete `systemctl` käskudega, nt:

 käsk | selgitus
------|----------
`sudo systemctl start mongodb` | käivita teenus `mongodb`
`sudo systemctl stop mongodb` | peata teenus `mongodb`

Ülalolevates näidetes saab siis `mongodb` asemel kasutada `tarastat`.

Teenuste `tarastat` ja `mongodb` käivitamise järjekord ei ole oluline. Kuid peab arvestama, et `tarastat` sõltub `mongodb`-st - kui logibaas ei ole üleval, siis ei saa logikirjeid salvestada ega statistikat väljastada.

### 2.9 Monitooringuga ühendamine

Päringu `https://<tara-stat>/status` saamisel kontrollib TARA-Stat oma logibaasi ülevalolekut. Kui logibaas on üleval, siis tagastatakse HTTP vastus `200` `OK`,
- vastasel korral `500` `Internal Server Error`.

### 2.10 Diagnostika

TARA-Stat ülevalolekut saab lõppkasutaja seisukohast kontrollida nii:
- lülitu tööarvutiga organisatsiooni sisevõrku (VPN)
- sirvikus ava `https://<tara-stat>:<tara-stat-https-port>`.

Märkus. Kui rakendus peaks teatama, et ühendus ei ole turvaline, siis see on tingitud _self-signed_ serdist. Aktsepteeri turvaerind. Ilmub rakenduse avaleht. Kui paigaldatud on organisatsiooni CA poolt väljaantud sert, siis teadet ei tule. 

TARA-Stat masinas saab teenuste `tarastat` ja `mongodb` ülalolekut kontrollida:

 käsk | selgitus
------|----------
`systemctl status tarastat` | kuva teenuse `tarastat` staatus
`systemctl status mongodb` | kuva teenuse `mongodb` staatus

Samuti saab kasutada diagnostikaskripti. Diagnostikaskript väljastab `systemctl status` raportid teenuste `tarastat` (TARA-Stat veebirakendus) ja `mongodb` (logibaas) kohta. Pööra tähelepanu:
- kas `Active` väärtus on `active (running)` (roheline)
- 10 viimasele logiteatele.

`sudo bash /opt/TARA-Stat/scripts/Diagnoosi.sh`

Lisaks väljastab skript teatmikteabe kummagi teenuse oluliste asukohtade kohta.

Probleemide lahendamiseks saab kasutada teenuse enda logisid (vt jaotis "Olulised asukohad").

### 2.11 Logibaasi haldamine

Kui tekib vajadus välja selgitada, mis seisus on MongoDB andmebaasi sisu või või logibaasi tühjendada, siis tee järgmist:

käsk | selgitus
-----|---------
`mongo -u andmehaldur -p changeit -authenticationDatabase users;` | ava MongoDB käsureavahend, logides sisse kasutajaga `andmehaldur`
`use logibaas` | lülitu logibaasile
`show collections` | peab näitama: `autentimised`
`db.autentimised.find().sort({_id:1}).limit(5);` | kuva 5 viimast kirjet
`db.autentimised.remove({})` | tühjenda logibaas
`exit` | välju CLI-st

Andmebaasi kasutajaid haldamiseks tuleb käsureavahendisse sisse logida administraatorina:

käsk | selgitus
-----|---------
`mongo -u userAdmin -p changeit -authenticationDatabase admin` | ava MongoDB käsureavahend, logides sisse kasutajaga `userAdmin`
`show dbs` | kuva andmebaasid. Loetelus peab olema `admin` ja ´logibaas`
`use admin` | lülitu andmebaasile `admin`
`show users` | kuva kasutajakontod valitud andmebaasis; peab näitama kasutajat `admin`
`use users` | lülitus andmebaasile `users`
`show users` | kuva kasutajakontod andmebaasis `users`; peab näitama kasutajaid `andmehaldur` ja `rakendus`
`db.auth("andmehaldur", "changeit")` | logi sisse andmehaldurina

Vaata lisaks:
- [mongo](https://docs.mongodb.com/manual/reference/program/mongo/)
- [mongo Shell Quick Reference](https://docs.mongodb.com/manual/reference/mongo-shell/)

## 3 Testimine

Testimisvahendeid toodangus ei kasutata. Neid võib repo sisuga koos tootmismasinasse kopeerida, kuid neid ei ole vaja (ega tohigi) skriptidega ega muul viisil aktiveerida.

### 3.1 Logikirjete lisamise testrakendus

`LogikirjeteSaatmiseTest.js` lihtne Node.js rakendus, mis etendab logikirjeid TARA-Stat logibaasi saatvat TARA-Server-it.

Testrakendus kasutab kaustas `/opt/tara-ci-config` olevad seadistust ja võtmeid.

Testrakenduse võib käivitada TARA-Stat-ga samas masinas.

Soovi korral võib testrakenduse paigaldada eraldi masinasse. Selleks tuleb täita kõik ülalkirjeldatud paigaldussammud, v.a MongoDB paigaldamine ja paigaldussammus "Seadista TARA-Stat veebirakendus" vastata veebiteenuse käivitamise küsimusele eitavalt.

Testrakenduse käivitamiseks sisesta: 

`cd /opt/TARA-Stat/TEST`
`nodejs LogikirjeteSaatmiseTest`

Iga käivitamisega genereeritakse juhuslikult teatud arv logikirjeid ja saadetakse TARA-Stat logibaasi.

## 4 Turvamine

TARA-Stat-is on rakendatud järgmised turvavalikud.

### 4.1 Juurdepääsu kaitse

1. TARA-Stat paigaldatakse eraldi VM-i. VM-is ei ole teisi rakendusi. 
1. TARA-Stat on ligipääsetav ainult organisatsiooni sisevõrgus.
1. Logikirje lisamise otspunkt (Syslog TCP ühendus) on kaitstud kahepoolselt iseallkirjastatud (self-signed) sertidega.
1. Statistika väljastamise otspunkt API võtmega kaitset ei vaja, kuid on ligipääsetav ainult organisatsiooni sisevõrgus.
1. Elutukse otspunkt on ligipääsetav ainult organisatsiooni sisevõrgus.
1. Veebirakendus pöördub MongoDB poole eraldi andmebaasikasutajana (`rakendus`). Andmebaasikasutaja autenditakse. Kasutusel on MongoDB vaikimisi autentimismehhanism - soolaga salasõna põhine.
1. Admin on eraldi andmebaasikasutaja.
1. Nii veebirakendus kui ka MongoDB käitatakse eraldi, spetsiaalsete kasutajate alt (`tarastat` ja `mongodb`).
1. Ligipääs andmebaasile (kirjutamine) on kaitstud ka failisüsteemi õiguste tasemel.
1. Andmebaas ei ole nähtav VM-st väljapoole. Andmebaasi kasutab ainult samas masinas asuv veebirakendus. 

### 4.2 Transpordi kaitse
1. Veebirakenduse API-s on kasutusel ainult HTTPS.
1. Veebirakenduse ja MongoDB suhtluses ei rakendata TLS-i. Kuna andmebaas suhtleb ainult samas masinas oleva rakendusega ja masinas ei ole teisi rakendusi, ei ole TLS-i hädavajalik.

### 4.3 Sisendi puhastamine 
Kaitse on rakendatud ohuvektorile: rakenduse kokkujooksmine vales vormingus andmete saatmisel logikirjete vastuvõtmise otspunkti (puhvri ületäitumine eraldajateta kirjete puhul; viga JSON-kirje parsimisel). 

### 4.4 Andmebaasi kaitse
1. Andmebaasi ei krüpteerita, kuna konfidentsiaalsusvajadus ei ole kõrge.
1. Andmebaasi auditilogi ei peeta, kuna terviklusvajadus ei ole nii kõrge.

Vajadusel vt taustaks:
- MongoDB [turvakäsitlus](https://docs.mongodb.com/manual/security/) sisaldab [turvameelespead](https://docs.mongodb.com/manual/administration/security-checklist/) rea soovitustega.

## 5 Käideldavus

TARA-Stat-i võib logikirjeid saata mitu TARA-Serveri instantsi.

TARA-Stat ise ei ole mõeldud mitmes instantsis paigaldamiseks. Mitmes instantsis paigaldamine oleks küll võimalik, kuid kasutusstatistika koguneks siis instantside kaupa.

## LISA 1 Veateated

Sirviku teated:

| teade v käitumine | võimalik põhjus |
|--------------|------------------|
|  `connection refused` | rakendus on maas |

Veebirakenduse veateated:

kood | veateade | vea lahendamise soovitus
ERR-01 | Logibaasiga ühendumine ebaõnnestus | Kas MongoDB töötab? Kas TARA-Stat veebirakendus on logibaasiga ühendumiseks seadistatud?
ERR-02 | Viga logibaasist lugemisel | Kas MongoDB töötab?
ERR-03 | Valesti moodustatud logikirje | Kontrollida logikirje saatmist TARA-Serveris
ERR-04 | Logibaasi poole pöörduja autentimine ebaõnnestus | Kontrollida API kasutajanime ja võtit
ERR-05 | Kirjutamine logibaasi ebaõnnestus | Kontrollida kettamahtu ja kirjutamisõigusi
