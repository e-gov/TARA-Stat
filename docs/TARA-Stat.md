---
permalink: Juhend
---

### Paigaldusskriptid
Paigaldamisel kasuta skripte:

| skript | ülesanne |
|--------|----------|
| `TARA-Stat-paigalda-kood.sh` | paigaldab rakenduse koodi git repost VM-i |
| `TARA-Stat-paigalda-Nodejs.sh` | paigaldab Node.js |
| `TARA-Stat-paigalda-MongoDB.sh` | paigaldab MongoDB ja seadistab logibaasi |
| `TARA-Stat-seadista-rakendus.sh` | seadistab veebirakenduse |
| `TARA-Stat-diagnoosi.sh` | väljastab diagnostilist teavet paigalduse kohta |

### Paigaldusjärjekord

**Esmakordne paigaldamine**. Valmista VM ja paigalda Ubuntu (16 LTS server).

1\. täida `TARA-Stat-paigalda-kood.sh`
2\. täida `TARA-Stat-paigalda-Nodejs.sh`
3.\ täida `TARA-Stat-paigalda-MongoDB.sh` (2. ja 3. järjekord ei ole oluline)
4\. täida `TARA-Stat-seadista-rakendus.sh`

`TARA-Stat-diagnoosi.sh` võib käivitada igal ajal; see skript ei muuda paigaldust.

**Tarkvarauuenduse paigaldamine**. Kui tarkvarauuendus ei puuduta Node.js ega MongoDB-d, siis piisab 1. ja 4. sammu läbitegemisest. Täpne juhis, kas võimalik on osaline uuestipaigaldamine, peab kaasas olema konkreetse tarkvarauuendusega.

Väikese tarkvarauuenduse puhul on võimalik ka värskenduste tõmbamine repot üle kirjutamata:

`git pull origin master` (kaustas `TARA-Stat`)

Enne seda tuleb aga teha

`git checkout .`

sest kuna rakenduse seadistamisel on `config.js` muudetud, siis pull-i tegemisel tekib muidu konflikt.

### Käivitamine, staatus ja seiskamine

Nii TARA-Stat veebirakendus kui ka MongoDB käitatakse systemd hallatavate teenustena`. 

|    | TARA-Stat veebiteenus | MongoDB (logibaas) |
|----|-----------------------|--------------------|
| systemd teenusenimi | `tara-stat` |  `mongodb`  |
| käitav Ubuntu kasutaja | `tarastat` | ´mongodb` |

Teenused käivitatakse ja seisatakse standardsete `systemctl` käskudega, nt:

`systemctl start mongodb`
`systemctl status mongodb`
`systemctl stop mongodb`

Teenuste käivitamise järjekord ei ole oluline.

**TARA-Stat ülevaloleku lõppkontroll**. Ava sirvikus `https://tara-stat-<site>:5000`. Rakendus teatab, et ühendus ei ole turvaline. See on tingitud self-signed serdist. Aktsepteeri turvaerind. Ilmub rakenduse avaleht.

### Veadiagnostika

| teade v käitumine | võimalik põhjus |
|--------------|------------------|
|  `connection refused` | rakendus on maas |
| `Logibaasiga ühendumine ebaõnnestus' | MongoDB on maas |

**Rakenduse logi**.
- MongoDB andmebaasilogi asub: `/var/log/mongodb/mongod.log`
- Node.js- endal logi ei ole
- Veebirakendus logib faili, mille asukoht vaikimisi on `/opt/TARA-Stat/log.txt`. Logifaili asukoht on veebirakenduse konf-ifailis seatav.

