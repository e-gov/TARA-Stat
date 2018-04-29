# Mikroteenuste arhitektuuri poole
{: .no_toc}

v 0.1, 29.04.2018

- TOC
{:toc}

Käesolevast kirjutisest võiks saada mikroteenuste _primer_. Praegu on see aga kirjeldus ühe mikroteenuse tegemisest.

## 1. Kontekst

Meil ei jätku inimesi, kes kõik vajalikud e-teenused välja arendaks, olemasolevaid uuendaks ja innovatsiooni sisse tooks. See paneb otsima võimalusi IT-d senisest teistmoodi teha. Nagu iga keerulise probleemiga, on probleemi raske sõnastada. Puudu ei ole inimestest, vaid ... aga milles täpselt on probleem? Avaliku sektori IT on keeruline, aeganõudev ja kohmakas. Tuleb lisada, et sageli ka tehnoloogiliselt vananenud.

Süsteemide ehitamisest koosnevana mikroteenustest räägitakse IT-maailmas praegu palju. Mida mikroteenus annab? Kirjandusest ei saa selget pilti. Seetõttu teeme protsessi ise läbi ja üritame mikroteenuste plusse ja miinuseid kogemuse põhjal hinnata.

Kontekstiks on keskmine või suurem organisatsioon, kes haldab oma IT-taristut. Taristust teame niipalju, et seal töötab palju mitmesuguseid süsteeme, rakendatakse virtualiseerimist. Tehnoloogiate poolest palju selliseid, mis tüüpilised sama suurusega organisatsioonidele. Nagu igal pool, on aktuaalne IT automatiseerimine, sest inimesi kõige vajaliku ärategemiseks napib. Turvanõuete poolest on süsteemid erinevad, kuid üldiselt on turvanõuded kõrged.

## 2. Mikroteenus

(µT) on iseseisva elutsükliga, kiiresti arendatav, selgepiiriliste liidestega, iseseisev, ühte kasulikku funktsiooni täitev rakendus.

**Iseseisva elutsükliga**. Mida see tähendab? µT arendus ei pea käima süsteemi teiste osade arendusega ühte jalga. µT tehakse valmis ja pannakse tööle. Muudetakse siis, kui on vaja.

**Kiiresti arendatav**. See on väga tähtis omadus. µT peaks olema arendatav u nädalaga. Vajadusel äravisatav ja nädalaga uuesti kirjutatav. Miks äravisatavus ja ümberkirjutatavus on tähtis? Sest sellega leevenevad või langevad hoopis tahaplaanile monoliitsüsteemide puhul üliolulised küsimused nagu programmeerimiskeelte, raamistike, teekide ja tehnoloogiate valik. Nende valikule kulutatakse meeletult aega ja sageli pannakse ka mööda. Monoliitsüsteemi puhul tähendab mõne komponenttehnoloogia väljavahetamine enamasti terve süsteemi ümberkirjutamist. Kiiresti arendatavusel on ka palju teisi häid omadusi.

**Selgepiiriliste liidestega**. Liidesed tuleb hoida võimalikult lihtsad ja kompaktsed. Suhtlus teiste komponentidega peab toimuma võimalikult laialt levinud, universaalses keeles. Tänapäeva universaalne liidesekeel REST stiilis HTTP(S) protokoll, andmete edastusega JSON-s. (See ei tarvitse nii jääda, sest keeled arenevad. Vt nt [JSON-RPC](http://www.jsonrpc.org/)).

**Iseseisev**. Iseseisvus tähendab võimalikult väheseid sõltuvusi (_dependencies_). Mitte ainult sõltuvused teistest (mikro)teenustest, vaid ka kasutatavatest teekidest, raamistikest jm tehnoloogiatest. 

µT sõltuvuste arv peab olema väike. Iga liides on sõltuvus. Iga kasutatav teek, tehnoloogia või arendusvahend on samuti sõltuvus.
{: .adv}

Sõltuvuseks võib olla ka liiga keerukas arendusprotsess.
{: .adv}

Miks see on oluline? Kuigi µT on äravisatavad ja ümberkirjutatavad, on siiski kasulik neid aeg-ajalt täiendada. µT arendus ei tohiks olla pidev. Kergem on meelde tuletada ja muuta koodi, mis on kirjutatud laialt levinud keeles.

**Ühte kasulikku funktsiooni täitev**. Ühe funktsiooni tõttu langevad ära või lihtsustuvad mitmed monoliitarenduses palju aega ja energiat nõudvad tööd. Vaja ei ole spetsiaalset süsteemi kasutusjuhtude kirjelduste haldamiseks - kasutusjuhtusid ongi 2-3. 

## 3. 7 päeva

µT peaks olema (ümber-)kirjutatav u nädalaga.
{: .adv}

Milliste tööde ja toimingute vahel see aeg jaguneb? Koodi kirjutamine on ainult osa arendusest. Arendust mõistame siin DevOps vaatenurgast. S.t arendus on kõik see, mis ei ole teenuse käitamine. Arendamine on ka tarkvara paigaldamine. Planeerin järgmise ajakava:

päev    | töö                | tulemus  | edenemine   |
--------|--------------------|----------|:-----------:|
1\.     | arenduskeskkonna ülesseadmine,<br> koodi kirjutamine  | repo loodud, teegid ja tehnoloogiad valitud, vähemalt üks otspunkt teostatud | OK |
2\.     | koodi kirjutamine (jätk) | kõik otspunktid teostatud, äriloogika põhiosas teostatud (v.a nt turvakontrollid); arendaja masinas töötab; testitud käsitsi | OK |
3\.     | API spetsifikatsiooni jm dokumentatsiooni kirjutamine | µT API ja muu dok-n koostatud ja rahuldavas seisus | OK |
4\.     | paigaldusprotsessi ja -plaani koostamine, paralleelselt tarkvara viimistlemine, eriti turvalisuse tõstmise seisukohalt (_hardening_) | paigaldusplaan | |
5\.     | testpaigalduse läbitegemine; paralleelselt tarkvara viimistlemine, eriti turvalisuse tõstmise seisukohalt (_hardening_) | paigaldamine läbi mängitud | |
6\.     | toodangusse paigaldamine, klientide teavitamine | µT on kasutusvalmis; klientidele on teenust esitletud | |

## 4. TARA-Stat

### 4.1 Funktsioon

TARA-Stat on eksperimentaalne µT [autentimisteenuse TARA](https://e-gov.github.io/TARA-Doku) kasutusstatistika tootmiseks ja vaatamiseks. Olemas on varem koostatud spetsifikatsioon: [TARA kasutusstatistika](https://e-gov.github.io/TARA-Doku/Statistika).

TARA-Stat pakub:
- võimalust autentimisteenuses fikseeritud autentimistoimingute logimiseks, hilisema statistikaarvutamise tarbeks
- võimalust logi põhjal lihtsa - kuid autentimisteenuse haldamiseks vajaliku - statistika arvutamiseks ja vaatamiseks
  - eelkõige huvitab autentimiste arv klientrakenduste lõikes ajaperioodil

Ongi kõik. Kohe tekib küsimus, kas seda pole liiga vähe? See µT on spetsialiseeritud logi. Logimine on ulatuslik teema. Logitakse mitmel erineval eesmärgil - turvamine, kasutajate pöördumiste lahendamine, teenuse ülaloleku seiramine jm. Autentimisteenuses TARA on juba oma, keerukas logilahendus - mis on (potentsiaalselt) ühendatud võimsa keskse logisüsteemiga. Kas siis eraldi, spetsialiseeritud logilahendusel on mõtet? See on mittetriviaalne, kuid väga oluline küsimus. Eraldi logilahendusel puuduks mõte, kui olemasolev võimas, väga paindlik ja paljude omadustega, _out-of-the-box_ logisüsteem oleks seadistatav vajaduse lahendamiseks vähema ajaga kui kulub µT arendamiseks. Praktika näitab siiski, et võimsate universaallahenduste tundmaõppimine ja seadistamine võib olla väga töömahukas. Ise tehes saame teha täpselt selle mida vajame - täpselt nii nagu tahame. Küsimusele kumb on parem - kas ise tehtud µT või seadistatud võimas universaalne vahend - ei ole universaalset vastust. Ise põlve otsas tegemine nõuab oskusi ja on kahtlemata riskantne. Kuid reaalsed riskid on ka suurte universaalsete valmislahenduste puhul. Näeme ju praktikas ikka ja jälle, kuidas majja tuuakse ilus ja võimas raamistik, meetod või keel, kuid selle juurutamine võtab aastaid ning suur osa vahendi võimalustest jäävad kasutamata. Igal juhul oleme µT puhul oma kahjusid tõkestanud - äraviskamisel kaotame maksimaalselt ühe nädala töö. Kui arvestada õppimist, siis tõenäoliselt vähem.

µT peab täitma ühtainust ülesannet (millel võib olla mitu tahku v osaülesannet).
{: .adv}

### 4.2 Komponendid

µT- sisestruktuur peab olema lihtne. µT TARA-Stat koosneb kahest komponendist ja neljast liidesest.

Komponendid:
- rakendus
  - serveripoolne osa
  - kasutaja sirvikusse laetav osa
- andmebaas.

Liidesed:
- logikirje lisamise liides
- statistika väljastamise liides
- logibaasi haldamise liides
- elutukse liides.

### 4.3 Olek

Vahel seatakse tingimuseks, et µT ei tohi hoida olekut (_state_). Minu meelest see ei ole põhjendatud. Olekuta (_stateless_) µT oleks pelgalt teisendaja (vrdl Amazon pilve lambda-funktsioon). Kusagil peab olekut hoidma ja kui lööme äriloogika µT-teks, oleku aga viskame kõik ühte PostgreSQL andmebaasi, siis see viib minu meelest tagasi monoliitlahenduse suunas. Kesksel andmebaasil on suured eelised, eelkõige sünkroonimise probleemi lahendamises. Vägisi pealesunnitud keskne andmebaas võib siiski olla ainult näiliselt efektiivne. Kui toetatav äriloogika olemuselt ongi hajus - s.t et süsteemi äriloogiline olek ei saagi olla igal ajamomendil kooskõlaline - siis on keskne sünkroonimine kunstlik ja raskesti tajutavaid probleeme tekitav. Iga süsteemi puhul ei sobi ka oleku hoidmine "kliendi poolel" (s.t sirvikus). 

Minu µT-stel võib olla ka olek (_state_) ja TARA-Stat puhul nii ongi. TARA-Stat olek ei ole keerukas. Olekuks on logi. Logikirjed on ühtse struktuuriga.

#### 4.3.1 Oleku hoidmise tehniline lahendus

Nii lihtsat andmestruktuuri võiks hoida tavalises logifailis. Siiski on TARA-Stat-is kasutusel andmebaasisüsteem (MongoDB). See on oluline otsus. Oleku hoidmise tehnoloogiavalikul olid alternatiivid:
- fail(id)
- PostgreSQL andmebaas
- MongoDB andmebaas.

Valik on tehtud arendaja (antud juhul mina ise) kompetentside ja eelistuste põhjal. Ka see on väga oluline moment. Monoliitsüsteemis on tehnoloogiate kombineerimine võimatu. Tehnoloogiavalikud tehakse üks kord, kõige ja kõigi jaoks. See on valuline protsess. Tihti saavad otsuse tegemisel määravaks hoopis kõrvalised asjaolud. MongoDB on suhteliselt uus, nn Non-SQL andmebaasitehnoloogia. MongoDB veebisait väidab, et nende süsteemi kasutamisel on elutsüklikulud 10 korda väiksemad kui relatsioonilise andmebaasi puhul. See on diskuteeritav. Praegu on ka küsimus, kas eraldi andmebaasisüsteemi kasutamine ühe µT puhul on õigustatud. Andmebaasisüsteem võimaldab ühes paigalduses hoida erinevaid andmebaase; need on üksteisest isoleeritud. Tõepoolest, aga siis peaks andmebaas olema pakutud teenusena (_Database as a Service_). (Näiteks sedasama MongoDB-d pakutakse ka pilveteenusena). Küsimus on teenuse kvaliteedis. Kui on olemas dokumenteeritud, usaldusväärne, kiirelt reageeriva kasutajatoega, mõistliku hinnaga, kergelt kasutatav (andmebaasi)teenus, siis muidugi ei ole mõtet hakata ise andmebaasi püsti panema. Praegu lähtume, et selliste omadustega teenust ei ole.

Andmebaasi teema juures tuleb märkida veel seda, et andmebaasi haldamine, sh jõudluse, andmete säilimise, kooskõlalisuse ja turvalisuse tagamine on suur töö. Praktiliselt nõuab see spetsialiseerumist- eraldi andmebaasiasjatundjat (DBA-d). Siin on kindlasti vastuolu, sest µT väike arendusmaht ei luba arendusmeeskonnas spetsialiseerumist (eriti kui arendusmeeskond ongi üks inimene).

TARA-Stat olek õnneks ei ole keerukas. Nõuded andmekvaliteedile ei ole ka väga kõrged. Statistika kvaliteet ei kannata, kui väike hulk logikirjeid peaks ka kaduma minema. Olukord võib siiski kiiresti muutuda, kui logi peaks hakatama kasutama klientidele arvete esitamiseks (_billing_). Siis peaks arvestus olema täpne.  

### 4.4 Programmeerimiskeel

TARA-Stat on kirjutatud Javascriptis. Täpsemalt, tehnoloogiapinu on järgmine (järgnev loetelu ei sisalda organisatsiooni IT-taristu spetsiifilisi tehnoloogiad - nende nimetamine ei oleks turvakaalustluste tõttu hea praktika):
- rakendus
  - serveripoolne osa
    - Node.JS
      - Express
      - MongoDB Driver
  - sirvikusse laetav osa
    - HTML5, CSS, Javascript
    - jQuery, Google Material Design ikoonis
- andmebaas
  - MongoDB
- avalik koodirepo 
  - GitHub  
- dokumentatsioon
  - Jekyll
- arendusvahendid
  - koodi kirjutamine
    - Visual Studio Code
  testimine
    - Visual Studion Code Debugger
    - [httpie](https://httpie.org/) - (HTTP käsureaklient. Kasulik REST API-de uurimisel ja silumisel. Väidetavalt parem kui curl.)

Tehnoloogiad on valitud kasinuse põhimõttel. Kasutatud (tehtud strateegiliste valikute raames) võimalikult standardseid vahendeid.

Ühes µT-s kasutatavate tehnoloogiate (teekide, keelte jms) hulka tuleb hoida kontrolli all. Valida tuleb ainult vajalikud, soovitavalt üldlevinud vahendid. Vahendid ei tohi olla lahendatava ülesande suhtes liiga "võimsad".
{: .adv}

Ühe µT sisetehnoloogiad ei tohi mõjutada teise µT sisetehnoloogiate valikut.
{: .adv}

Tehnoloogiate valimisel ei saa läbi katsetamiseta. Kulutasin omajagu aega [RESTHEart](http://restheart.org/) - MongoDB veebiliides s.o rakendus, mis ühendub MongoDB külge ja võimaldab REST API kaudu andmebaasi kasutada - uurimisele. Ühel hetkel sain aru, et lisalüli ei ole vaja ja lihtsam on  MongoDB veebiliides kirjutada ise, kasutades standardset MongoDB Node.JS draiverit. (See on väga tüüpiline. Internetis pakutakse palju raamistikke, vahendeid jms, mis on ehitatud teise vahendi peale ning nagu pakuksid lisaväärtust. Arvestades, et iga vahendit tuleb tundma õppida ja häälestada, on tihti kasulik sellistest kahtlast lisaväärtust pakkuvatest vahekihtidest loobuda ja programmeerida ise, standardsete vahenditega.)

### 4.5 Töö jätkamine teise arendaja poolt

Kas teine arendaja saab tööd TARA-Stat-ga jätkata? Usun, et jah, saab - kui ta tunneb µT-ses kasutatud võtmetehnoloogiaid või on valmis neid õppima. Praegusel juhul MongoDB ja Node.JS. (HTTP REST tundmist eeldan.) Koodi maht on väike - 200 LOC. See on kindlasti endale selgeks tehtav. Kasutatud on standardseid, laialt tuntud teeke. 

Kui arendaja peaks MongoDB või Node.JS mitte tudnma ega soovi neid õppida, siis tuleb TARA-Stat kood ära visata ja rakendus ümber kirjutada. Näiteks PostgreSQL ja Java Spring kasutamisega. Koodi kirjutamiseks on kulutatud 1-2 päeva. Ümberkirjutamine teise keelde ei tohiks rohkem aega võtta.

Äravisatavus ja ümberkirjutatavus on µT tähtsamate omaduste hulgas.
{: .adv}

### 4.6 Kasutajad

TARA-Stat-l on neli võimalikku kasutajat. (Kasutajaks loeme µT-ga suhtlevat osapoolt. Kasutajad võivad olla inim- või masinkasutajad).

**Statistikakasutaja**  on autentimisteenust TARA käitava organisatsiooni teenistuja - teenusehaldur või tootejuht- kes vajab teavet teenuse kasutamise mahu, sh trendide kohta. Statistikakasutajale tuleb pakkuda statistikat. Eriti vajalik on teave teenuse tarbimismahtudest klientrakenduste lõikes. Statistikakasutajal peab olema võimalik ette anda periood, mille kohta statistika arvutatakse. Statistikakasutajal ei tohi olla võimalust logi muuta. Juurdepääs statistikale peab olema piiratud; ainult määratud isikud, määratud töökohtadelt.

**TARA-Server** saadab TARA-Stat-i logikirjeid. TARA-Server võib olla paigaldatud mitmes instantsis.

**Süsteemihaldur** omab täielikku juurdepääsu TARA-Stat masinale. Süsteemihaldur saab, kasutades MongoDB standardvahendeid - MongoDB Compass ja CLI mongo - vajadusel kustutada logibaasist vanu kirjeid. (Kasutusstatistika pakub huvi u aasta jooksul). See on harv tegevus.

**Monitooringusüsteem** saab TARA-Stat-le saata "elutuksepäringu". TARA-Stat vastab, kas ta toimib.

### 4.7 Liidesed

Kasulikul µT-l on tavaliselt 2-3 liidest. Liideste kvaliteet (lihtsus, selgus, kasulikkus) on väga oluline. Liideseid on kahte tüüpi: masinliidesed ja inimkasutaja liidesed (_UI_). 

 TARA-Stat pakub 4 liidest. Neist kaks on peamised ja kaks on toetavad. Liideseid nimetan ka otspunktideks. Liidestest arusaamiseks on abiks arhitektuurijoonis (vt joonis 1). 

<p style='text-align:center;'><img src='img/Arhi.PNG' width= "500"></p>

Joonis 1. TARA-Stat üldistatud arhitektuur

Järgnevalt liidestest tehniliselt ja lähemalt.

#### 4.7.1 Logikirje lisamise otspunkt

Saata `POST` päring `localhost:5000` (või paigaldusaadressil), mille kehas on JSON kujul

`{ "aeg": ..., "klient": ..., "meetod": ... }`

Näiteks, [httpie](https://httpie.org/) abil:

`http POST :5000 aeg=2018-04-29T00:00:30 klient=e-teenusA meetod=mobileID`

#### 4.7.2 Statistika väljastamise otspunkt (statistikakasutaja UI)

- Statistikakasutaja sirvikus avada leht `localhost:5000` (või paigaldusaadressil).
- Määrata periood (võib jääda ka tühjaks)
  - sisestades regulaaravaldise
  - nt `2018-04` valib 2018. a aprilli logikirjed
  - vajutada nupule
  - kuvatakse autentimiste arv perioodi jooksul klientrakenduste lõikes

<p style='text-align:center;'><img src='img/Capture.PNG' width= "650"></p>

Joonis 2. Statistikakasutaja UI

#### 4.7.3 Elutukse otspunkt

Päringu `localhost:5000/status` saamisel kontrollib TARA-Stat oma logibaasi ülevalolekut.
- Kui logibaas on üleval, siis tagastatakse HTTP vastus `200` `OK`,
- vastasel korral `500` `Internal Server Error`.

#### 4.7.4 Andmebaasi haldamise liides

Admin saab, kasutades MongoDB standardvahendeid - MongoDB Compass ja CLI mongo - vajadusel kustutada logibaasist vanu kirjeid.

## 5 Turvamine

Analüüsime võimalusi µT turvamiseks.

## 5.1 Andmebaasi turve

MongoDB [turvakäsitlus](https://docs.mongodb.com/manual/security/) sisaldab [turvameelespead](https://docs.mongodb.com/manual/administration/security-checklist/) rea soovitustega. 

 turvameede | rakendada    |
------------|:------------:| 
| sisse lülitada andmebaasi poole pöördujate autentimine<br>- lihtsaim autentimismehhanism on MongoDB vaikimisi autentimismehhanism. See on soolaga salasõna põhine. | jah |
| rakendada rollipõhist pääsuhaldust | jah |
| rakendada TLS | ? (andmebaas suhtleb ainult samas masinas oleva rakendusega. Masinas ei ole teisi rakendusi) |
| andmebaasi krüpteerimine | ei (konfidentsiaalsusvajadus ei ole kõrge) |
| kaitsta andmebaasi failisüsteemi õigustega | ? |
| piirata võrgus nähtavust | jah |
| andmebaasi auditilogi | ei (terviklusvajadus ei ole nii kõrge) |

## 6 Veateated

ERR-01: Logibaasiga ühendumine ebaõnnestus<br>
ERR-02: Viga logibaasist lugemisel

## 7 Kasulikku

### 7.1 MongoDB

MongoDB
- [paigaldusjuhend Windows-le](https://docs.mongodb.com/master/tutorial/install-mongodb-on-windows/)
- käivitamine (Windows): `"C:\Program Files\MongoDB\Server\3.6\bin\mongod.exe"`
- pääsuhaldus
  - [Enable Auth](https://docs.mongodb.com/manual/tutorial/enable-authentication/)

MongoDB Compass
- [juhend](https://docs.mongodb.com/compass/current/)

mongo
- "an interactive JavaScript shell interface to MongoDB"
- [ülevaade](https://docs.mongodb.com/manual/mongo/)
- [Reference](https://docs.mongodb.com/manual/reference/program/mongo/#bin.mongo)
- käivitamine: `mongo`

MongoDB server
- käivitamine: `mongod`
- käivitamisel vaikimisi(?) seotakse localhost-ga. S.t väljast tulevaid pöördumisi ei teeninda. Välispöördumiste teenindamiseks käivitada `--bind_ip <address>` või `--bind_ip_all`.
- vaikimisi teenindab pordil `27017`.
- konsoolile logib ühendusi.

MongoDB standardne pääsumehhanism - [Salted Challenge Response Authentication Mechanism](https://docs.mongodb.com/manual/core/authentication-mechanisms/).
[Pääsu seadmise juhend](https://docs.mongodb.com/manual/tutorial/enable-authentication/) (MongoDB)

Rakendus suhtleb MongoDB-ga TCP/IP socket-i põhise [MongoDB wire protocol](https://docs.mongodb.com/manual/reference/mongodb-wire-protocol/)-iga.

MongoDB Node.JS Driver 
- [ülevaade](http://mongodb.github.io/node-mongodb-native/?jmp=docs&_ga=2.138292915.2088530382.1524857109-302204577.1524857109)
- [dok-n](http://mongodb.github.io/node-mongodb-native/3.0/)

- [Aggregation Pipeline](https://docs.mongodb.com/manual/core/aggregation-pipeline/)
- [Using the Aggregation Framework](http://mongodb.github.io/node-mongodb-native/2.0/tutorials/aggregation/)


### 7.2 Node.JS

ejs
[EJS Syntax Reference](https://github.com/mde/ejs/blob/master/docs/syntax.md)
