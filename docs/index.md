Mis asi on `changeit`? -- Kõik salasõnad ja paigaldustaristu parameetrid (hostinimed, pordinumbrid jms) tekstis ja repo koodis on näitlikud.
{: .adv}

# Mikroteenuste A & O (koos töötava näitega)
{: .no_toc}

5\. päev, 09.05.2018<br><br>

<p style='text-align:right;'><i>Do one thing and do it well</i> &mdash; <a href='https://en.wikipedia.org/wiki/Unix_philosophy' target='_new'>Unix_philosophy</a></p>

Käesoleval kirjutisel on kaks osa. Esimeses osas arutlen küsimuste üle, mis mikroteenuste (µT) arhitektuuris praktikas olulised. Tuleb tõdeda, et paljudele küsimustele ei ole veel selgeid vastuseid.

Teise osa moodustab ühe konkreetse mikroteenuse - TARA-Stat - kirjeldus.

## Sisukord
{: .no_toc}

laiem ülevaade mikroteenustest: [1 Vajadus ja väljakutse](#1-vajadus-ja-v%C3%A4ljakutse)

TARA-Stat ülevaade: [2 TARA-Stat](#2-tara-stat)

paigaldajale ja käitajale: [3 Paigaldamine](#3-paigaldamine), [4 Käitamine](#4-k%C3%A4itamine)

arendajale: [5 Arendamine](#5-arendamine)

## Detailne sisukord
{: .no_toc}

- TOC
{:toc}

## 1. Vajadus ja väljakutse

Monoliitrakenduse arendamine ja paigaldamine on tüüpiliselt pikk ja vaevaline protsess. Miks see nii on? Raskused on osalt objektiivsed, sest kvaliteedi- ja turvanõudeid on palju ja neid ei saa ignoreerida. Monoliitrakendusi mikroteenustega asendades peaksime vältima, et töömaht ei multiplitseeruks. Mikroteenus ei tohiks olla samaväärne andmekoguga - kogu sellest tuleneva arendus- ja haldusbürokraatiaga. Samas peavad kõik olulised kvaliteedi- ja turvanõuded olema täidetud ka mikroteenuste puhul. See on võib-olla suurim väljakutse.

### 1.1 Kontekst

Meil ei jätku inimesi, kes kõik vajalikud e-teenused välja arendaks, olemasolevaid uuendaks ja innovatsiooni sisse tooks. See paneb otsima võimalusi IT-d senisest teistmoodi teha. Nagu iga keerulise probleemiga, on probleemi raske sõnastada. Puudu ei ole inimestest, vaid ... aga milles täpselt on probleem? Avaliku sektori IT on keeruline, aeganõudev ja kohmakas. Tuleb lisada, et sageli ka tehnoloogiliselt vananenud.

Süsteemide ehitamisest koosnevana mikroteenustest räägitakse IT-maailmas praegu palju. Mida mikroteenus annab? Kirjandusest ei saa selget pilti. Seetõttu teeme protsessi ise läbi ja üritame mikroteenuste plusse ja miinuseid kogemuse põhjal hinnata.

Kontekstiks on keskmine või suurem organisatsioon, kes haldab oma IT-taristut. Taristust teame niipalju, et seal töötab palju mitmesuguseid süsteeme, rakendatakse virtualiseerimist. Tehnoloogiate poolest palju selliseid, mis tüüpilised sama suurusega organisatsioonidele. Nagu igal pool, on aktuaalne IT automatiseerimine, sest inimesi kõige vajaliku ärategemiseks napib. Turvanõuete poolest on süsteemid erinevad, kuid üldiselt on turvanõuded kõrged.

### 1.2 Mikroteenus

Mikroteenus (µT) on iseseisva elutsükliga, kiiresti arendatav, selgepiiriliste liidestega, iseseisev, ühte kasulikku funktsiooni täitev rakendus.
{: .note}

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

### 1.3 7 päeva

µT peaks olema (ümber-)kirjutatav u nädalaga.
{: .adv}

Milliste tööde ja toimingute vahel see aeg jaguneb? Koodi kirjutamine on ainult osa arendusest. Arendust mõistame siin DevOps vaatenurgast. S.t arendus on kõik see, mis ei ole teenuse käitamine. Arendamine on ka tarkvara paigaldamine. Planeerin järgmise ajakava:

päev    | töö                | tulemus  | edenemine   |
--------|--------------------|----------|:-----------:|
1\.     | arenduskeskkonna ülesseadmine,<br> koodi kirjutamine  | repo loodud, teegid ja tehnoloogiad valitud, vähemalt üks otspunkt teostatud | OK |
2\.     | koodi kirjutamine (jätk) | kõik otspunktid teostatud, äriloogika põhiosas teostatud (v.a nt turvakontrollid); arendaja masinas töötab; testitud käsitsi | OK |
3\.     | API spetsifikatsiooni jm dokumentatsiooni kirjutamine | µT API ja muu dok-n koostatud ja rahuldavas seisus | OK |
4\.     | paigaldusprotsessi ja -plaani koostamine, paralleelselt tarkvara viimistlemine, eriti turvalisuse tõstmise seisukohalt (_hardening_) | paigaldusplaan | OK |
5\.     | testpaigalduse läbitegemine; paralleelselt tarkvara viimistlemine, eriti turvalisuse tõstmise seisukohalt (_hardening_) | paigaldamine läbi mängitud | OK |
6\.     | toodangusse paigaldamine, klientide teavitamine | µT on kasutusvalmis; klientidele on teenust esitletud | |
7\.     | puhkus | |

### 1.4 Mikroteenuste tehnoloogiad

Kas µT eeldab konkreetseid programmeerimiskeeli vm tehnoloogiaid? Arvan, et:
- µT sees kasutatud tehnoloogia ei ole määrav.
- µT peaks teiste µT-ga suhtlema üldlevinud võrguprotokollide kaudu. Tänapäeval on selleks HTTPS. (Kindlasti on ka erijuhte).
- µT liidesed (API) üldjuhul peaks järgima REST stiili ja andmestruktuuride esituseks üldjuhul on JSON. Kuid ka siin on erijuhte.

### 1.5 Mikroteenuste turvalisus

Kõik olulised turvanõuded tuleb täita ka µT puhul. See on tõsine väljakutse, sest "vahemaa" µT-te vahel on suurem ja usalduse loomine ning kontrollimine nõuab lisameetmeid. Monoliitrakenduses pannakse kõik komponendid ühte patta kokku. "Ühes pajas" on komponentide identimine, autentimine ja ühenduste turvamine kas triviaalne või vähemalt palju lihtsam kui µT puhul. µT-d suhtlevad üle võrgu. Seetõttu on vaja võrguliiklust kaitsta.

Olukorda teeb ainult mõnevõrra lihtsamaks asjaolu, et µT-l võib puududa suhtlus organisatsioonist väljapoole. Ka sisevõrgus on vaja suhtlevaid osapooli autentida, reguleerida pääsuõigusi ja kaitsta andmete transporti.

Keskendumegi siin järgmistele turvalisuse küsimustele: suhtlevate osapoolte autentimine, pääsuõiguste reguleerimine ja andmete transpordi kaitse.

#### 1.5.1 Turvakontekst

µT kaitsmisel on oluline selgitada välja µT tegutsemise **turvakontekst**. Turvakonteksti määratleme siin kui µT paigaldus- ja kasutusümbrusest tulenevaid nõudeid µT turvalisusele.

Turvakontekst ja sellest tulenevad turvaeesmärgid ning -nõuded on olulised mitte sellepärast, et keegi tahaks - mingist abstraktsest ühtlustamise ideest lähtudes - kehtestada nõudeid nõuete pärast.

Eespool sai märgitud, et isoleerimine ei saa kunagi olla täielik. (Krüptograafia terrminites - mingi kõrvalkanal (_side channel_) jääb alati). Seetõttu tuleb arvestada, et ka suhteliselt madala ohuprofiiliga µT, olles IT-taristu üks osa, võib potentsiaalselt - kui turve jäetakse hooletusse - mõjutada teisi, hoopis tähtsamaid süsteeme.

Peamised põhjused on vajadus takistada võimaliku ründaja edasipääs teistesse süsteemidesse, samuti takistada tõrgete levik taristu teistesse osadesse.

Ründajal ei tohi olla võimalus kasutada rakendust lävepakuna IT-taristu teistesse osadesse.
{: .adv}

Rakenduse võimalike tõrgete levik IT-taristu teistesse osadesse peab olema tõkestatud.
{: .adv}

Hea näide on allpool käsitletav µT TARA-Stat. TARA-Stat on kasutusstatistika kogumise ja esitamise rakendus. TARA-Stat turvanõuded ei ole eriti kõrged. Isikuandmeid ei töödelda ja juhtimisotsuste tegemiseks - milleks TARA statistikat vaja on - ei ole statistika täpsus eriti oluline. Kuid see ei tähenda, et TARA-Stat turvamine oleks väheoluline. TARA-Stat paigaldatakse organisatsiooni IT-taristusse (arvutivõrku).

TARA-Stat turvakonteksti võime sõnastada järgmiselt: kuna µT paigaldatakse taristusse, kus võivad töötada teised, väga olulised teenused ja süsteemid (nt Valimiste infosüsteem - me ei taha, et potentsiaalseltki ründaja saaks µT kaudu sellele ligi), siis tuleb µT hoolikalt isoleerida ja ühendada ainult vajalike teiste teenustega. Samuti peab ligipääs µT kasutajaliidesele olema ainult inimkasutajatele, kes teavet vajavad.

#### 1.5.2 Isoleerimine

Organisatsiooni IT-taristu on suur ja keerukas. Taristu turbe üks tähtsamaid eesmärke on rakenduste **isoleerimine** e eraldihoidmine.

Isoleerimise mõiste on paremini arusaadav, kui mõtleme tavaliselt (veebi)sirvikust nagu Chrome või Firefox. Sirvikus jookseb mitmeid rakendusi ja sirviku ülesanne on need eraldi hoida. See tähendab, et rakendusel ei tohi olla mingit võimalust mõjutada teisel sakil või teises aknas töötavat teist rakendust - ega tohi teadagi teistest sirvikusse laetud veebilehtest. Ja uut lehte tohib laadida ainult lähtedomeenist (samaallikapoliitika, _same origin policy_).

Rakendused isoleeritakse mitmel tasandil: masina, rakenduse, süsteemi, alamvõrgu, kogu IT-taristu tasandil.

Pilve- ja µT kontekstis on kiiresti arenenud **konteineritehnoloogiad** (Docker, Kubernetes jm). Parimat viisi ei ole veel välja kujunenud.
{: .note}

Isoleerimine peaks olema lahendatud süsteemselt, kõiki taristukihte läbivalt. See on väljakutse igasuguste rakenduste, nii µT kui ka monoliitide puhul, sest ühel inimesel on raske tunda kõiki kihte. Kui aga erinevates taristukihtides lahendavad turvaprobleeme erinevad inimesed, siis terviku kokkusobitumiseks peavad nad tegema koostööd - ja selle eeldusena - olema võimelised üksteisest aru saama.

Ei ole _overkill_ kasutada **OSI kihimudelit**, võib-olla valides sealt relevantsed kihid ja lisades vastavalt vajadusele lisakihte. Üldistatult on kaks kihti e tasandit: rakenduse tasand ja võrgu tasand. Detailsemalt võiks eristada nelja kihti:
- rakenduse kiht
- protokolli kiht
- võrgu kiht (OSI layer 3)
- andmeühenduse tasand (OSI layer 2).

#### 1.5.3 Autentimine

Rakenduse tasandil on suhtluse osapoolte autentimiseks mitu võimalust:

sümmeetriline võti (salasõna)
- rühma võti
- individuaalne võti

asümmeetriline võtmepaar
- ise tõendatud (_self-signed_)
- sertifitseerimisteenuse poolse tõendamisega (_certification authority_, CA)

- organisatsiooni enda CA
- väline CA

autentimisteenus (_trusted third party_).

**Sümmeetriline võti** e salasõna (_secret_), on sõne vm väärtus, mida teavad suhtluse mõlemad osapooled (ja ainult nemad) (vähemalt võtmevahetuse etapil - hiljem võib üks osapool hoida salasõna räsi). Pöörduja paneb salasõna päringusse kaasa. Masinliidese puhul nimetatakse API võtmeks (_API Key_), Inimliidese puhul parooliks. Salasõna on lihtne, järeleproovitud lahendus väikese arvu suhtlevate osapoolte korral. 

**Asümmeetrilise võtmepaari** puhul on kasutusel kaks üksteisega krüptograafiliselt seotud võtit - avalik ja privaatvõti. Privaatvõtme omanik edastab teisele osapoolele ainult avaliku võtme. Osapool tõendab oma identiteeti, allkirjastades sõnumi oma privaatvõtmega. Ühtlasi tagatakse sõnumi muutumatus transpordil.

Asümmeetrilise võtmepaari kasutamisel on kaks varianti avaliku võtme edastamiseks. Isetehtud sertifikaadi (_self-signed certificate_) korral genereerib avaliku võtme tõendi (sertifikaadi) privaatvõtme omanik ise. Sertifikaadid esitatakse tavaliselt X.509 võtmevormingus.

Osapoolte suure arvu puhul on otstarbekas kasutada **sertifitseerimisteenust** (_certification authority_, CA). Organisatsioon võib oma tarbeks pidada sertifitseerimisteenust ise (_enterprise CA_) või kasutada väliste CA-de teenuseid.

**Autentimisteenuse** (_trusted third party_) kasutamisel delegeeritakse autentimine välisele (kolmandale), usaldatavale osapoolele. Autentimist vajav osapool suunatakse autentimisteenusesse, kus tema identiteet kindlaks tehakse. Osapool esitab autentimisteenuse poolt väljaantud tõendi (_bearer token_). Kontrolliv osapool võib ka ise pöörduda autentimisteenuse poole kinnituse saamiseks. Levinud _trusted third party_ protokollid on OAuth 2.0, OpenID Connect ja SAML.

Autentimisskeemi valik sõltub suhtluspartnerite arvust ja stabiilsusest ning kas suhtluspartnerid kuuluvad ühe ja sama või erinevate organisatsioonide haldusalasse.

Võtmeküsimus (_pun intended_) on kes kannab võtmehalduse kulu või sertifitseerimis- või autentimisteenuse osutamise kulu. CA teenused pole tasuta ja ka organisatsiooni enda CA pidamine on kulu.

µT puhul, mis pakub masinliidest väikesele arvule, kindlatele partneritele, võiks kasutada sümmeetrilist API võtit.

Turvalisust ei saa tasuta. Juurdepääsu piiramist vajava API korral ei pääse võtmehaldusest või välise autentimis- või sertifitseerimisteenuse ostmisest.
{: .adv}

Võrgu tasandil saab samuti autentida, kontrollides teise osapoole IP-aadressi. Kuid  tavaliselt ei loeta seda piisavaks. Osapoole (siis rakenduse) IP ei tarvise olla piisavalt püsiv. Samuti peetakse IP-aadresside võltsimist (_IP spoofing_) teatavaks ohuks.

Kokkuvõttes, autentimine on alati kulu. Sellest kulust saab vabaneda ainult siis, kui autentimine pole vajalik s.t teenust saab osutada anonüümsele kasutajale. Pääsu piiramise vajadus võib siiski olla ka anonüümteenuse korral. Sellest järgmistes jaotistes.

#### 1.5.4 Võrgule avatuse piiramine

Üks peaeesmärke on **piirata võrgule avatust** (_Network Exposure_). Selleks tehakse seadistustoiminguid võrguseadmetes, võrku ühendatud masinates ja võrgutarkvaras.

Masina tasandil piiratakse võrguliiklust masina ja välismaailma vahel. Seda tehakse Linux-i tulemüüri (iptables) seadistamisega.

Vt nt:
- [Linux-i tulemüüri algaja juhend](https://www.howtogeek.com/177621/the-beginners-guide-to-iptables-the-linux-firewall/)).
- [How to setup a UFW firewall on Ubuntu 16.04 LTS server](https://www.cyberciti.biz/faq/howto-configure-setup-firewall-with-ufw-on-ubuntu-linux/)

Windows-is on analoogiline võimalus (Netsh).

Ruuteri tasandil piiratakse võrgu piiril toimuvat liiklust.

Virtuaalse kohtvõrgu (_virtual LAN, VLAN_) tasandil määratakse, millised masinad pannakse kokku ühte virtuaalsesse kohtvõrku.

**Kas igal µT-l peab olema oma tulemüür?** Tulemüür pakub võrgukihi (ISO kihimudelis 3. kiht, _layer 3_) kaitset. Kuna µT on rakendus (ISO kihimudeli 7. e rakenduskiht). Kui iga µT puhul peab lisaks rakenduskihi turvamisele tegelema võrguturbega, siis lisab see kulu ja keerukust. Linuxi UFW (_Uncomplicated Firewall_) on täiesti peale pandav ja seadistatav. Kas see aga on alati vajalik? Tundub, et vastuse peab andma konkreetsest käitluskeskkonnast lähtuv ohu- ja mõjuanalüüs:
- kes paigaldab µT masinasse tarkvara?
- millised riskitasemega tarkvara (tuntud v vähetuntud)?
- kas võrguliiklust piiratakse juba mõnes teises kaitseliinis?

#### 1.5.5 Pääsu jagamine

Meeldib see meile või mitte, kuid oluliste tagajärgedega toiminguid saavad teha ainult vastavate volitustega isikud. Standardne mehhanism on rollipõhine pääsuhaldus (_role-based access control_, RBAC) ja sellest pääseme ainult siis, kui µT on tõeliselt _single purpose_ s.t ongi ainult üks toiming. µT-ses endas ei ole rollihalduse teostamine otstarbekas ega mõeldavgi. µT-ses endas peaks olema ainult autenditud kasutaja rolli kontrollimine. Rollide omistamine ja äravõtmine peaks käima väljaspool. 

µT tavaliselt ei suuda ise teha rollihaldust, vaid vajab seda teenusena.
{: .adv}

#### 1.5.6 Ühendamine

Eraldamine ei ole siiski kunagi absoluutne. Veebisirviku näites oleksid veebilehed väga primitiivsed kui veebileht suhtleks ainult oma serveripoolega. **Ühendamine* on isoleerimise vastandprotsess. Koos moodustavad need dialektilise terviku, omamoodi yingi ja yangi. Samas sirvikus töötavate veebirakenduste ühendamiseks ongi loodud erinevaid võimalusi: allikavaheline ressursijagamine, _cross origin resouce sharing_ (_CORS_), `postMessage` API, vanematest JSONP.

#### 1.5.7 Transpordi turvamine

Monoliitrakenduses ei ole komponentidevahelise andmeedastuse turvamine probleem. Üks Java meetod kutsub välja teist. Kõik see toimub Java virtuaalmasina (JVM) sees. Eeldame, et JVM-s keegi pealt ei kuula ega vahele ei sekku. _That's it_. µT-sed aga on paigaldatud igaüks eraldi ja seetõttu peavad suhtlema üle vähem või rohkem ebaturvalise võrgu.

µT peaks suhtlema turvatud protokolli kaudu. Levinuim protokolli selles suhtluses on HTTP. 

µT-l peaks olema HTTPS võimekus.
{: .adv}

#### 1.5.8 Tundliku taristuteabe ja saladuste kaitse

Avaarenduse (_open source_) kasud on nii arvukad ja suured, et tänapäeval avaarendus peaks olema eelistatud arendusmudel. Siiski on avaarenduses teavet, millele juurdepääsu on vaja piirata.

**Tundlik taristuteave** on teave organisatsiooni IT-taristu kohta, mida ründaja saaks kasutada, võimalik, et ühitades muu teabe või võimekustega, IT-taristusse sissemurdmiseks või taristus edasiliikumiseks. Mõistega pean silmas eelkõige mitmesuguseid organisatsioonist **väljapoole mittepaistvaid** parameetreid, nt:
- hosti- ja domeeninimed
- IP-aadressid
- pordid
- kasutajanimed
- tundlik dokumentatsioon, nt erilisi turvameetmeid konkreetselt kirjeldavad paigaldusjuhendid.

Tundlikuks taristuteabeks ei loe teavet, mida on kerge tuletada, mis ei oma ründe seisukohalt tähtsust või mis on niigi avalikult teada. Tundlikku taristuteavet on raske piiritleda, sest mõistes põrkuvad mitu üksteisega vastukäivat turvaprintsiipi:

**Security by obscurity** ("turvalisus teadmatuse läbi") väidab, et parim turvalisus saavutatakse süsteemi siseehituse täieliku ärapeitmisega. Mida vähem välismaailm süsteemist teab, seda turvalisem. Kuid mitmed eksperdid peavad security by obscurity-t mitte väga turvaliseks või isegi antipattern-ks.

**Multi-level security** ("mitme kaitseliini" printsiip) ütleb, et ei saa lootma jääda ühele kaitsele. Ükski kaitsemeede eraldivõetuna ei ole piisav. Turvameetme rakendaja võib eksida, meetme valesti seadistada. Meede võib tõrkuda jne. Seetõttu on vaja mõelda ühest kaitsest läbimurdnud ründaja edasiliikumise takistamisele.

**Kerckhoffi printsiip** ütleb, et süsteemi turvalisus tuleb koondada väikesesse arvu saladustesse. Süsteemi ülesehitus ja algoritm võib ja peabki olema avalik. Ainult võti on salajane. Nii tagatavat parim kaitse.

**Saladused** (_secrets_) on krüptograafilised võtmed, serdid, salasõnad, krüptograafiliste ja turvaprotokollide salajased parameetrid.

Praktikas tuleb arvestada, et süsteem peab olema ka kasutatav. Samuti, turvameetmete rakendamise eelarve ei ole piiramatu. Olulised on järgmised elemendid (vt illustreeriv joonis):

<p style='text-align:center;'><img src='img/SALADUSED.PNG' width= "400"></p>

- avalik kood ja dokumentatsioon, tundlik taristuteave ja saladused hoitakse eraldi
- erinevate eesmärkidega paigaldusi (arendus, testimine, toodang) tehakse kombineerides avalikku koodi, tundlikku taristuteavet ja saladusi 
- kõik ei saa olla tundlik; kõik ei saa olla salajane
- tundlikust taristuteabest ja saladustest on selge ülevaade
- avalikus koodis ja dokumentatsioonis on tundlikud taristuparameetrid ja saladused asendatud näiteväärtustega, nt `changeit`.
- näiteväärtusi ei kasutata toodangus
- tundlik taristuteave on organisatsiooni siserepos (dokumendi- v koodirepos või mõlemas)
- saladuste hoidmiseks on oma kord ja tehniline lahendus.

### 1.6 "It works on my machine!"

Küpsusaste 0 - Ei tööta veel üheski keskkonnas

Küpsusaste 1 - Arendaja masinas töötab

<p style='text-align:center;'><img src='img/TEST-01.PNG' width= "500"></p>

Arendaja on paigaldanud kõik arendatavad komponendid, nende käitamiseks vajaliku süsteemitarkvara (veebiserveri, andmebaasisüsteemi jms) ja testiprogrammid (maketid e _mock-up_-id jms) oma arvutisse. Tihti pannakse ka sidusteenused, millele arendaja masinast on raske juurde pääseda, arendaja arvutisse. Arvuti huugab. Arendaja masinas arendamine on efektiivne, kuna sidusteenuseid kas veel ei ole või asuvad need tulemüüride taga. Silumisvahendite (__debugger_-te) kasutamine on hõlbus. Veebiteenused suhtlevad lokaalse masina (`localhost`) kaudu. Imiteeritakse veebiliiklust ja põhimõtteliselt kõik nagu töötaks. _It works on my machine!_ Toodangukeskkonnas aga ollakse veel väga kaugel. Allpool tuleb juttu mikroteenusest TARA-Stat. TARA-Stat peab toodangus töötama eraldi masinas, Linux Ubuntu op-süsteemis. TARA-Stat peab suhtlema teises masinas töötava TARA-Serveriga (Java rakendus Ubuntu virtuaalmasinas (VM)) ja pakkuma statistikakasutajale veebiteenust. Arendaja masinas aga on kõik üheskoos, Windows-is. Kuigi tarkvara on testitud - TARA-Serveri asemel on makettrakendus `mockup`, on toodangusse siit veel pikk tee. 

Küpsusaste 2 - Toodangulähedases keskkonnas paigaldatud, osa otspunkte käsitsi testitud

<p style='text-align:center;'><img src='img/TEST-02.PNG' width= "400"></p>

µT on juba paigaldatud toodanguga sarnasesse keskkonda - Ubuntu virtuaalmasinasse. Testitud on ühte otspunkti (statistika väljastamist). Seda tehti pöördumisega arendaja Windows-masinast. Asi töötas! Paigaldusjuhend on oluliselt ümber töötatud, sest kuigi Node.js ja MongoDB töötavad mõlemas op-süsteemis, on Windows-sse ja Ubuntusse paigaldamisel arvukalt erinevusi. Seni on paigaldusjuhend veel teksti kujul. Eesmärk on jõuda automaatselt täidetava paigaldusskriptini.

Küpsusaste 3 - Toodangulähedases keskkonnas kõik otspunktid testitud, sh maketiga

<p style='text-align:center;'><img src='img/TEST-03.PNG' width= "500"></p>

Samm-sammult tuleb liikuda toodangu poole. Järgmisena on kavas paigaldada makettrakendus eraldi virtuaalmasinasse ja selle abil läbi mängida suhtlus TARA-Serveri ja µT vahel. Küsimus ei ole mitte niivõrd sõnumivormingutes ja äriloogikas - see on testitud - kui andmevahetuse käimapanemises sisevõrgus, pääsuõiguste jms testimises.

Küpsusaste 4 - (kava) Testkeskkonnas töötab

...

Paigaldusjuhis on lõplikult koostatud ja hoolikalt läbi tehtud. Paigaldamine on adekvaatselt automatiseeritud paigaldusskripti(de) abil. Süsteemiadministraator on juhise järgi paigalduse probleemideta läbi teinud.

Küpsusaste 5 - (lõpp-eesmärk) Toodangus töötab

<p style='text-align:center;'><img src='img/Arhi.PNG' width= "500"></p>

Reaalsed kasutaja, reaalsed andmed, reaalsed teenused.

### 1.7 Konfigureerimine

Konfigureerimine e seadistamine täidab mitut eesmärki:

- **Rakenduse kasutusvõimaluste laiendamine**. Tahetakse pakkuda palju variante, kuid konkreetses paigalduses tuleb valida neist sobivad. 

- **Erinevatesse keskkondadesse paigaldamise kergendamine**. See tähendab kõigi keskkonnaspetsiifiliste väärtuste (nt Windows versus Linux) parameetritena väljatoomist.

- **Tundliku teabe ja saladuste (paroolide, võtmete) eraldihoidmine**. Paroolidel on koodi omast erinev elukaar. Paroole ei ole mõtet rakenduse koodi sisse kirjutada kasvõi sellepärast, et koodi võib olla avalik.

Konfigureerimisviisid erinevad keerukuselt:
- konfigureerimine otse koodis (nt konf-iparameetrid faili alguses)
- konf-ifail(id)
- käivitamiskäsu parameetritena
- haldusliideses.

Konfigureerimine on tihti **mitmeastmeline**. Rakenduse juurde käib ikka eraldi konfiguratsioonifail. Käivitamisel loetakse konfiparameetrid (nende väärtused) konf-ifailist rakendusse. Sageli antakse "kõige viimase hetke" konfiguratsioon rakendusele käivituskäsu parameetritega. Käivituskäsu parameetrid on tugevamad kui konf-ifaili parameetrid.

Allpool kirjeldatud µT-s TARA-Stat on valitud konfigureerimine konf-ifailide abil. Konf-ifaile on kolm:
- veebirakenduse konf-ifail
- logibaasi konf-ifail
- testimisel kasutatava makettrakenduse konf-ifail.

## 2. TARA-Stat

### 2.1 Funktsioon

TARA-Stat on eksperimentaalne µT [autentimisteenuse TARA](https://e-gov.github.io/TARA-Doku) kasutusstatistika tootmiseks ja vaatamiseks. Olemas on varem koostatud spetsifikatsioon: [TARA kasutusstatistika](https://e-gov.github.io/TARA-Doku/Statistika).

TARA-Stat pakub:

- võimalust autentimisteenuses fikseeritud autentimistoimingute logimiseks, hilisema statistikaarvutamise tarbeks
- võimalust logi põhjal lihtsa - kuid autentimisteenuse haldamiseks vajaliku - statistika arvutamiseks ja vaatamiseks

Eelkõige huvitab autentimiste arv klientrakenduste lõikes ajaperioodil.

TARA-Stat kasutajaliides statistikakasutajale:

<p style='text-align:center;'><img src='img/Capture.PNG' width= "650"></p>

Ongi kõik. Kohe tekib küsimus, kas seda pole liiga vähe? See µT on spetsialiseeritud logi. Logimine on ulatuslik teema. Logitakse mitmel erineval eesmärgil - turvamine, kasutajate pöördumiste lahendamine, teenuse ülaloleku seiramine jm. Autentimisteenuses TARA on juba oma, keerukas logilahendus - mis on (potentsiaalselt) ühendatud võimsa keskse logisüsteemiga. Kas siis eraldi, spetsialiseeritud logilahendusel on mõtet? See on mittetriviaalne, kuid väga oluline küsimus. Eraldi logilahendusel puuduks mõte, kui olemasolev võimas, väga paindlik ja paljude omadustega, _out-of-the-box_ logisüsteem oleks seadistatav vajaduse lahendamiseks vähema ajaga kui kulub µT arendamiseks. Praktika näitab siiski, et võimsate universaallahenduste tundmaõppimine ja seadistamine võib olla väga töömahukas. Ise tehes saame teha täpselt selle mida vajame - täpselt nii nagu tahame. Küsimusele kumb on parem - kas ise tehtud µT või seadistatud võimas universaalne vahend - ei ole universaalset vastust. Ise põlve otsas tegemine nõuab oskusi ja on kahtlemata riskantne. Kuid reaalsed riskid on ka suurte universaalsete valmislahenduste puhul. Näeme ju praktikas ikka ja jälle, kuidas majja tuuakse ilus ja võimas raamistik, meetod või keel, kuid selle juurutamine võtab aastaid ning suur osa vahendi võimalustest jäävad kasutamata. Igal juhul oleme µT puhul oma kahjusid tõkestanud - äraviskamisel kaotame maksimaalselt ühe nädala töö. Kui arvestada õppimist, siis tõenäoliselt vähem.

µT peab täitma ühtainust ülesannet (millel võib olla mitu tahku v osaülesannet).
{: .adv}

### 2.2 Komponendid

µT- sisestruktuur peab olema lihtne. µT TARA-Stat koosneb kahest komponendist ja neljast liidesest.

Komponendid:

- rakendus (serveripoolne osa, kasutaja sirvikusse laetav osa)
- andmebaas (logibaas).

Liidesed:

- logikirje lisamise liides
- statistika väljastamise liides
- logibaasi haldamise liides
- elutukse liides.

### 2.3 Olek

Vahel seatakse tingimuseks, et µT ei tohi hoida olekut (_state_). Minu meelest see ei ole põhjendatud. Olekuta (_stateless_) µT oleks pelgalt teisendaja (vrdl Amazon pilve lambda-funktsioon). Kusagil peab olekut hoidma ja kui lööme äriloogika µT-teks, oleku aga viskame kõik ühte PostgreSQL andmebaasi, siis see viib minu meelest tagasi monoliitlahenduse suunas. Kesksel andmebaasil on suured eelised, eelkõige sünkroonimise probleemi lahendamises. Vägisi pealesunnitud keskne andmebaas võib siiski olla ainult näiliselt efektiivne. Kui toetatav äriloogika olemuselt ongi hajus - s.t et süsteemi äriloogiline olek ei saagi olla igal ajamomendil kooskõlaline - siis on keskne sünkroonimine kunstlik ja raskesti tajutavaid probleeme tekitav. Iga süsteemi puhul ei sobi ka oleku hoidmine "kliendi poolel" (s.t sirvikus). 

Minu µT-stel võib olla ka olek (_state_) ja TARA-Stat puhul nii ongi. TARA-Stat olek ei ole keerukas. Olekuks on logi. Logikirjed on ühtse struktuuriga.

#### 2.3.1 Oleku hoidmise tehniline lahendus

Nii lihtsat andmestruktuuri võiks hoida tavalises logifailis. Siiski on TARA-Stat-is kasutusel andmebaasisüsteem (MongoDB). See on oluline otsus. Oleku hoidmise tehnoloogiavalikul on alternatiivid:

- fail(id)
- PostgreSQL andmebaas
- MongoDB andmebaas.

Valik on tehtud arendaja (antud juhul mina ise) kompetentside ja eelistuste põhjal. Ka see on väga oluline moment. Monoliitsüsteemis on tehnoloogiate kombineerimine võimatu. Tehnoloogiavalikud tehakse üks kord, kõige ja kõigi jaoks. See on valuline protsess. Tihti saavad otsuse tegemisel määravaks hoopis kõrvalised asjaolud. MongoDB on suhteliselt uus, nn Non-SQL andmebaasitehnoloogia. MongoDB veebisait väidab, et nende süsteemi kasutamisel on elutsüklikulud 10 korda väiksemad kui relatsioonilise andmebaasi puhul. See on diskuteeritav. Praegu on ka küsimus, kas eraldi andmebaasisüsteemi kasutamine ühe µT puhul on õigustatud. Andmebaasisüsteem võimaldab ühes paigalduses hoida erinevaid andmebaase; need on üksteisest isoleeritud. Tõepoolest, aga siis peaks andmebaas olema pakutud teenusena (_Database as a Service_). (Näiteks sedasama MongoDB-d pakutakse ka pilveteenusena). Küsimus on teenuse kvaliteedis. Kui on olemas dokumenteeritud, usaldusväärne, kiirelt reageeriva kasutajatoega, mõistliku hinnaga, kergelt kasutatav (andmebaasi)teenus, siis muidugi ei ole mõtet hakata ise andmebaasi püsti panema. Praegu lähtume, et selliste omadustega teenust ei ole.

Andmebaasi teema juures tuleb märkida veel seda, et andmebaasi haldamine, sh jõudluse, andmete säilimise, kooskõlalisuse ja turvalisuse tagamine on suur töö. Praktiliselt nõuab see spetsialiseerumist- eraldi andmebaasiasjatundjat (DBA-d). Siin on kindlasti vastuolu, sest µT väike arendusmaht ei luba arendusmeeskonnas spetsialiseerumist (eriti kui arendusmeeskond ongi üks inimene).

TARA-Stat olek õnneks ei ole keerukas. Nõuded andmekvaliteedile ei ole ka väga kõrged. Statistika kvaliteet ei kannata, kui väike hulk logikirjeid peaks ka kaduma minema. Olukord võib siiski kiiresti muutuda, kui logi peaks hakatama kasutama klientidele arvete esitamiseks (_billing_). Siis peaks arvestus olema täpne.  

### 2.4 Programmeerimiskeel

TARA-Stat on kirjutatud Javascriptis. Täpsemalt, tehnoloogiapinu on järgmine (loetelus ei ole organisatsiooni IT-taristu turvaspetsiifilisi tehnoloogiaid):

 komponent                   | tehnoloogiad
-----------------------------|--------------------------
rakendus - serveripoolne osa | Node.js, Express, MongoDB JS Driver
rakendus - sirvikusse laetav osa | HTML5, CSS, Javascript, jQuery, Google Material Design ikoonid
andmebaas | MongoDB
avalik koodirepo | GitHub
dokumentatsioon | Jekyll
arendusvahendid - koodimine | Visual Studio Code (võib ka muu)
testimine | Visual Studion Code Debugger, [httpie](https://httpie.org/) - (HTTP käsureaklient. Kasulik REST API-de uurimisel ja silumisel. Väidetavalt parem kui curl.)

Tehnoloogiad on valitud kasinuse põhimõttel. Kasutatud on (tehtud strateegiliste valikute raames) võimalikult standardseid vahendeid.

Ühes µT-s kasutatavate tehnoloogiate (teekide, keelte jms) hulka tuleb hoida kontrolli all. Valida tuleb ainult vajalikud, soovitavalt üldlevinud vahendid. Vahendid ei tohi olla lahendatava ülesande suhtes liiga "võimsad".
{: .adv}

Ühe µT sisetehnoloogiad ei tohi mõjutada teise µT sisetehnoloogiate valikut.
{: .adv}

Tehnoloogiate valimisel ei saa läbi katsetamiseta. Kulutasin omajagu aega [RESTHEart](http://restheart.org/) - MongoDB veebiliides s.o rakendus, mis ühendub MongoDB külge ja võimaldab REST API kaudu andmebaasi kasutada - uurimisele. Ühel hetkel sain aru, et lisalüli ei ole vaja ja lihtsam on  MongoDB veebiliides kirjutada ise, kasutades standardset MongoDB Node.js draiverit. (See on väga tüüpiline. Internetis pakutakse palju raamistikke, vahendeid jms, mis on ehitatud teise vahendi peale ning nagu pakuksid lisaväärtust. Arvestades, et iga vahendit tuleb tundma õppida ja häälestada, on tihti kasulik sellistest kahtlast lisaväärtust pakkuvatest vahekihtidest loobuda ja programmeerida ise, standardsete vahenditega.)

### 2.5 Töö jätkamine teise arendaja poolt

Kas teine arendaja saab tööd TARA-Stat-ga jätkata? Usun, et jah, saab - kui ta tunneb µT-ses kasutatud võtmetehnoloogiaid või on valmis neid õppima. Praegusel juhul MongoDB ja Node.js. (HTTP REST tundmist eeldan.) Koodi maht on väike - 200 LOC. See on kindlasti endale selgeks tehtav. Kasutatud on standardseid, laialt tuntud teeke. 

Kui arendaja peaks MongoDB või Node.js mitte tudnma ega soovi neid õppida, siis tuleb TARA-Stat kood ära visata ja rakendus ümber kirjutada. Näiteks PostgreSQL ja Java Spring kasutamisega. Koodi kirjutamiseks on kulutatud 1-2 päeva. Ümberkirjutamine teise keelde ei tohiks rohkem aega võtta.

Äravisatavus ja ümberkirjutatavus on µT tähtsamate omaduste hulgas.
{: .adv}

### 2.6 Kasutajad

TARA-Stat-l on 5 võimalikku kasutajat. (Kasutajaks loeme µT-ga suhtlevat osapoolt. Kasutajad võivad olla inim- või masinkasutajad).

**Statistikakasutaja**  on autentimisteenust TARA käitava organisatsiooni teenistuja - teenusehaldur või tootejuht- kes vajab teavet teenuse kasutamise mahu, sh trendide kohta. Statistikakasutajale tuleb pakkuda statistikat. Eriti vajalik on teave teenuse tarbimismahtudest klientrakenduste lõikes. Statistikakasutajal peab olema võimalik ette anda periood, mille kohta statistika arvutatakse. Statistikakasutajal ei tohi olla võimalust logi muuta.

Kuna statistika on üldistatud ega sisalda isikuandmeid, lähtume statistika otspunkti turvamisel, et otspunkt on avatud organisatsiooni sisevõrgus, kõigile töötajatele.

**TARA-Server** saadab TARA-Stat-i logikirjeid. TARA-Server võib olla paigaldatud mitmes instantsis.

**Andmehaldur** on inimene, kes, kasutades MongoDB standardvahendeid - MongoDB Compass ja CLI mongo - kustutab logibaasist aegunud kirjeid. (Kasutusstatistika pakub huvi u aasta jooksul). See on harv tegevus.

**Admin** on inimene, kes paigaldab tarkvara, loob andmebaasi kasutajatele (TARA-Server, andmehaldur) kontod ja annab pääsuõigused.

**Monitooringusüsteem** saab TARA-Stat-le saata "elutuksepäringu". TARA-Stat vastab, kas ta toimib.

### 2.7 Liidesed

Kasulikul µT-l on tavaliselt 2-3 liidest. Liideste kvaliteet (lihtsus, selgus, kasulikkus) on väga oluline. Liideseid on kahte tüüpi: masinliidesed ja inimkasutaja liidesed (_UI_). 

TARA-Stat pakub 4 liidest. Neist kaks on peamised ja kaks on toetavad. Liideseid nimetan ka otspunktideks. Liidestest arusaamiseks on abiks arhitektuurijoonis (vt joonis 1). 

Järgnevalt liidestest tehniliselt ja lähemalt.

#### 2.7.1 Logikirje lisamise otspunkt

Saata `POST` päring `https://<tara-stat>` (kus `<tara-stat>` on TARA-Stat-i domeeninimi), mille kehas on JSON kujul

```
{ 
  "aeg": <ISO date>,
  "klient": <klientrakenduse nimi>,
  "meetod": <MobileID,  ID_CARD, eIDAS vm meetod>
}
```

`ISO date` on ajatempel kujul `2018-04-28`, millele võib järgneda kellaaja osa.

#### 2.7.2 Statistika väljastamise otspunkt (statistikakasutaja UI)

Statistikakasutaja sirvikus avada leht `https://<tara-stat>` (kus `<tara-stat>` on TARA-Stat-i domeeninimi).

Määrata periood (võib jääda ka tühjaks)
- sisestades regulaaravaldise
- nt `2018-04` valib 2018. a aprilli logikirjed
- vajutada nupule
- kuvatakse autentimiste arv perioodi jooksul klientrakenduste lõikes

#### 2.7.3 Elutukse otspunkt

Päringu `https://<tara-stat>/status` saamisel kontrollib TARA-Stat oma logibaasi ülevalolekut. Kui logibaas on üleval, siis tagastatakse HTTP vastus `200` `OK`,
- vastasel korral `500` `Internal Server Error`.

#### 2.7.4 Andmebaasi haldamise liides

Andmehaldur saab, kasutades MongoDB standardvahendeid - MongoDB Compass ja CLI mongo - vajadusel kustutada logibaasist vanu kirjeid.

### 2.8 Turvamine

#### 2.8.1 Ülevaade

Eeldame, et kuigi µT-st kasutatakse organisatsiooni sisevõrgus, ei saa paigalduskeskkonna täielikku turvalisust eeldada ([MFN 19.4](https://e-gov.github.io/MFN/#19.4)).

TARA-Stat koosneb kahest komponendist: veebirakendusest ja logibaasist. Veebirakendusel on kasutaja sirvikusse laetav osa. Turve peab hõlmama kõiki komponente.

TARA-Stat-is on rakendatud järgmisi turvameetmeid.

**Omaette VM**. TARA-Stat paigaldatakse eraldi VM-i. VM-is ei ole teisi rakendusi. 

**Ainult sisevõrgus**. Mikroteenus on ligipääsetav ainult organisatsiooni sisevõrgus.

**API kaitse võti**. Logikirje lisamise otspunkt kaitstakse API võtmega (salasõnaga). API võti paigaldatakse TARA-Serverisse ja pannakse kaasa igas päringus logikirje lisamise otspunkti poole.

Statistika väljastamise otspunkt API võtmega kaitset ei vaja, kuid on ligipääsetav ainult organisatsiooni sisevõrgus.

Elutukse otspunkt on ligipääsetav ainult organisatsiooni sisevõrgus.

**HTTPS**. Veebirakendus API-s ainult HTTPS.

**Andmebaasikasutaja autentimine**. Veebirakendus pöördub MongoDB poole eraldi andmebaasikasutajana (`rakendus`). Andmebaasikasutaja autenditakse. Kasutusel on MongoDB vaikimisi autentimismehhanism - soolaga salasõna põhine.

**Rollipõhine pääsuhaldus andmebaasis**. Admin on eraldi andmebaasikasutaja.

Veebirakenduse ja MongoDB suhtluses ei rakendata TLS-i. Kuna andmebaas suhtleb ainult samas masinas oleva rakendusega ja masinas ei ole teisi rakendusi, ei ole TLS-i hädavajalik.

Aandmebaasi ei krüpteerita, kuna onfidentsiaalsusvajadus ei ole kõrge.

Andmebaasi kaitstakse failisüsteemi õigustega. TODO Kuidas?

**Andmebaasi võrgus nähtavuse piiramine**. Andmebaas ei ole nähtav VM-st väljapoole. Andmebaasi kasutab ainult samas masinas asuv veebirakendus. 

Andmebaasi auditilogi ei peeta, kuna terviklusvajadus ei ole nii kõrge.

Vt ka: MongoDB [turvakäsitlus](https://docs.mongodb.com/manual/security/) sisaldab [turvameelespead](https://docs.mongodb.com/manual/administration/security-checklist/) rea soovitustega. 

#### 2.8.1 Õiguste plaan

Nimed on illustratiivsed ja paigaldamisel muudetavad.
{: .adv}

µT suhtleb teiste masinatega, erinevate inimestega. Teenindab ja kasutab ise teenuseid. µT enda sees on üksteisega suhtlevad komponendid. Suhtlevaid osapooli on ka väikese rakenduse puhul paras hulk. Erinevatel osapooltel on erinevad õigused. Õigusi peab olema parasjagu: mitte liiga palju (ebaturvaline), mitte liiga vähe (ei pääse teenusele ligi). Osapooltel on **identiteedid** (nimed), mida tõendavad **kredentsiaalid** (paroolid, võtmed). Kõike seda on omajagu. Sellest peab olema ülevaade ja see peab olema tasakaalus. **Õiguste plaani** eesmärk on anda täpne pilt rakendusega seotud osapooltest, nende rollidest ja õigustest, samuti kredentsiaalidest.

TARA-Stat käitluskontekstis on 9 osapoolt (subjekti), kes vajavad identiteedi ja kredentsiaalide andmist ning õiguste seadmist:
{: .note}

| kasutaja vm õiguste subjekt (_principal_), inimloetav nimi | subjekti masinloetav nimi | subjekti liik ja kirjeldus | kredentsiaalid |
|:-----------------------------------------:|:--------:|:-------:|:--------------:|
| **VM admin** | `vmadmin` | Ubuntu kasutaja, kes paigaldab tarkvara ja teeb muid haldustoiminguid | salasõna |
| **TARA-Stat** | `tarastat` | Ubuntu kasutaja, kelle alt käivitatakse TARA-Stat veebirakendus | salasõna |
| **MongoDB** | `mongodb` | Ubuntu kasutaja, kelle alt käitatakse Mongo DB andmebaas | 
| **MongoDB kasutajate haldur**| `userAdmin` | MongoDB kasutaja, kes haldab MongoDB kasutajaid. Seda rolli täidab VM admin | salasõna |
| **Rakendus** | `rakendus` | TARA-Stat veebirakenduse konto MongoDB-s | salasõna |
| **Andmehaldur** | `andmehaldur` | MongoDB konto, mille alt kustutatakse aegunud logikirjeid. Andmehalduri rolli täidab VM admin | salasõna |
| **Veebirakendus** | `https://<tara-stat>` | TARA-Stat veebirakendus | _self-signed_ sert |
| **Statistikakasutaja** | - | inimene, kes pöördub sisevõrgust TARA-Stat veebirakenduse statistika väljastamise otspunkti poole | - (ei autendita, juurdepääs piiratakse kontekstiga) |
| **TARA server** | `TARA-Server` | pöördub TARA-Stat logikirjete vastuvõtmise otspunkti poole | API kasutajanimi ja salasõna |

## 3 Paigaldamine

### 3.1 Ülevaade

TARA-Stat koosneb kahest komponendist:
- veebirakendus
- logibaas.

Mõlemad komponendid paigaldatakse samasse masinasse.

**Alustarkvara**:
- Ubuntu 16 LTS
- Node.js (vajab veebirakendus)
- MongoDB (vajab logibaas).

**Välisühendused**:
- TARA-Stat peab olema kättesaadav ainult organisatsiooni sisevõrgus,
- järgmistele inim- ja masinkasutajatele:
  - statistikakasutajale (tüüpiliselt teenusehaldur)
    - statistikakasutaja pöördub sirviku abil statistika väljastamise otspunkti
  - TARA-Server rakendusele
    - TARA-Server pöördub logikirje lisamise otspunkti.  
  - lisaks on TARA-Stat vajadusel võimeline pakkuma elutukse otspunkti organisatsiooni monitooringulahendusele.
  - TARA-Stat-le peab vajadusel olema juurdepääs ka andmehalduril, et kustutada aegunud logikirjed.
    - andmehaldur kasutab tööriista `mongo` (MongoDB Shell)
    - või MongoDB Compass - see on graafiline tööriist.

Logibaas suhtleb ainult veebirakendusega; ei suhtle masinast väljapoole.

**Olulised asukohad**:

- MongoDB
  - `/etc/mongodb.conf` - konf-ifail
  - `/var/log/mongodb/mongod.log` - andmebaasilogi
  - `/var/lib/mongodb` - andmebaasifailid
  - `/etc/init.d/mongodb` - automaatkäivitusskript

Täpsemalt TARA-Stat omaduste ja ehituses kohta vt jaotis 2. 

Vajadusel vt:
- [How to Install and Configure MongoDB on Ubuntu 16.04 LTS](https://www.howtoforge.com/tutorial/install-mongodb-on-ubuntu-16.04/) (HowtoForge)

### 3.2 Paigaldusjärjekord

Automaatpaigaldamiseks on kaustas `TARA-Stat/scripts` kaks skripti:
- `TARA-Stat-paigalda-MongoDB.sh` paigaldab logibaasi (MongoDB), sh moodustab andmebaasikasutajad
- `TARA-Stat-paigalda-Nodejs.sh` paigaldab Node.js, TARA-Stat veebirakenduse ja Node.js protsessihalduri pm2.

Skripti käivitamine:

```
cd $HOME/Tara-Stat/scripts
sudo bash TARA-Stat-paigalda-MongoDB.sh
sudo bash TARA-Stat-paigalda-Nodejs.sh
```

Skripte ei pea kasutama. Võib paigaldada käsitsi. Kuid ka skriptide kasutamisel tuleb osa toiminguid siiski teha käsitsi. Tee toimingud järgmiselt:

| toiming                            | käsitsi      | skriptiga  |
|------------------------------------|--------------|------------|
| paigalda VM ja op-süsteem (Ubuntu) |              |            |
| paigalda TARA-Stat veebirakendus   | jaotis 3.3   |            |
| paigalda MongoDB                   | jaotis 3.4   | `TARA-Stat-paigalda-MongoDB.sh` |
| paigalda Node.js                   | jaotis 3.5   | `TARA-Stat-paigalda-Nodejs.sh` |
| seadista TARA-Stat veebirakendus   | jaotis 3.6   | `TARA-Stat-paigalda-Nodejs.sh` |
| seadista VM tulemüür               | jaotis 3.7   |            |
| paigalda protsessihaldur pm2       | jaotis 3.8   | `TARA-Stat-paigalda-Nodejs.sh` |

### 3.3 Veebirakenduse paigaldamine

1\. Kopeeri veebirakendus ([https://github.com/e-gov/TARA-Stat](https://github.com/e-gov/TARA-Stat)) organisatsiooni sisereposse.

_Alternatiiv: paigalda otse GitHub-i repost._

2\. Paigalda veebirakendus koodirepost VM-i:

`git clone https://github.com/e-gov/TARA-Stat` (või kasutada vastavat organisatsiooni siserepot).

Järgnevas eeldame, et TARA-Stat asub kaustas `~/TARA-Stat`. Toodangukeskkonnas võib asukoht olla teine.
{: .adv}

3\. Sea veebirakenduse port (valikuline)

Ava kaustas `TARA-Stat` asuv veebirakenduse konf-ifail `config.js` ja vaheta pordi vaikeväärtus `443` õige vastu (nt `5000`).

Järgnevas eeldame, et port on `5000`.

### 3.4 Paigalda MongoDB

Vajadusel vt:
- [How to Install MongoDB on Ubuntu 16.04](https://www.digitalocean.com/community/tutorials/how-to-install-mongodb-on-ubuntu-16-04)
- [Install MongoDB Community Edition on Ubuntu](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-ubuntu/).

Paigalda MongoDB viimane stabiilne versioon.

Kui paigaldamine ebaõnnestus, siis võib olla vajalik andmefailide kustutamine kaustas `/var/lib/mongodb` enne uuesti paigaldamist.
{: .adv}

Paigalda pakettide kontrollimise võtmed:

`sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 2930ADAE8CAF5059EE73BB4B58712A2291FA4AD5`

Moodusta vajalik fail, et apt leiaks paketid üles:

`echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu xenial/mongodb-org/3.6 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-3.6.list`

Uuenda paketinimekirja:

`sudo apt-get update`

Paigalda ainult vajalikud MongoDB komponendid - andmebaasiserver `mongod` ja shell `mongo`:

`sudo apt-get install -y mongodb-org-server=3.6.4 mongodb-org-shell=3.6.4`

Alternatiiv: paigalda täiskomplekt (sisaldab ka serveris mittevajalikku MongoDB Compass tarkvara): `sudo apt-get install -y mongodb-org`.
{: .note}

Paigaldamisel luuakse kasutaja `mongodb` ja lisatakse ta kasutajate gruppi `mongodb`.

MongoDB lastakse käima kasutaja `mongodb´ alt. Seetõttu `mongodb` vajab kirjutusõigusi MongoDB logifaili ja andmebaasifailidele. Kui oled neid muutnud (määranud omanikuks teise kasutaja), siis saad `mongodb` uuesti omanikuks seada järgmiselt:
{: .adv}

```
sudo chown mongodb /var/log/mongodb/mongod.log
cd /var/lib/mongodb
sudo chown -R mongodb:mongodb *
```

Kontrolli paigaldust: `mongod --version`

Sea kasutajale `mongodb` parool: `sudo passwd mongodb`

Seadista MongoDB. Leia konfi-fail `/etc/mongodb.conf`. Veendu, et seadistused sobivad. Vajadusel muuda. Autentimist (`auth=`) ei ole hetkel vaja veel sisse lülitada. Nt andmebaasi kaust on `/var/lib/mongodb`. 

Vajadusel vt [MongoDB Configuration](https://docs.mongodb.com/manual/administration/configuration/).

Käivita MongoDB (teenusena, `systemctl` abil, kasutaja `mongodb` all):

`sudo systemctl start mongod`

Kontrolli, et andmebaas käivitus: `sudo systemctl status mongod`

_Alternatiiv: MongoDB käivitamine käsu `service` abil:_

`sudo service start mongodb`

_Vajadusel vt: [systemctl ja service seletus](https://askubuntu.com/questions/903354/difference-between-systemctl-and-service)_

_Alternatiiv: MongoDB käivitamine taustaprotsessina, konfi-faili näitamisega:_

`mongod --config /etc/mongod.conf &`

Logibaasi (MongoDB andmebaasi) ja selles kogumit (_collection_) ei ole vaja luua. Need luuakse esimese logikirje salvestamisel.
{: .note}

Logibaasile tuleb luua kolm kasutajat:

- `userAdmin` - kasutajate haldur
- `rakendus` - TARA-Stat veebirakendus
- `andmehaldur` - haldur, kes saab aegunud logikirjeid kustutada

Kasutajate eristamine on vajalik pigem tuleviku vajadusi arvestades. Protseduuri vt [Enable Auth](https://docs.mongodb.com/manual/tutorial/enable-authentication/).

Kasutajakontosid hoitakse samuti MongoDB andmebaasides. MongoDB standardpraktika kohaselt kasutajate halduri kontot hoiame andmebaasis `admin`. Teiste kasutajate kontosid hoiame andmebaasis `users`.

Käivita MongoDB konf-ifaili äranäitamisega ja kasutaja `mongodb` alt:

`su -c 'mongod --config /etc/mongod.conf &' - mongodb`

_Kui soovid MongoDB käima lasta teise kasutaja alt, siis anna kasutajale, kes andmebaasi käivitab, õigused andmebaasifailidele ja andmebaasilogile:_

```
sudo chown -R kasutajanimi /var/lib/mongodb
sudo chown -R kasutajanimi /var/log/mongodb
```

_Seejärel käivita MongoDB (taustaprotsessina):_

`mongod --config /etc/mongodb.conf &`

----

Kasulik on meelde jätta andmebaasiserveri protsessinumber. Veendu, et andmebaas on käivitunud, nt: `ps aux` või `top`.

MongoDB logi: `/var/log/mongodb/mongodb.log`.

Taga, et andmete kaust, vaikimisi `/var/lib/mongodb` on olemas ja andmebaasiserveril on õigused sinna kirjutada. Vajadusel korrigeeri failisüsteemi pääsuõigusi, nt: `sudo chmod -R ug+rw /var/lib/mongodb`.
{: .note}

Ühendu CLI-ga andmebaasi külge: `mongo`. Seejärel:

Loo kasutajate haldur.

Sisesta või kopeeri allolevad käsud `mongo` dialoogi, viiba `>` järele:

`use admin`

```
db.createUser(
  {
    user: "userAdmin",
    pwd: "changeit",
    roles: [ { role: "userAdminAnyDatabase", db: "admin" } ]
  }
)
```

Lülita sisse rollihaldus. Peata andmebaasiserver ja sea andmebaasi konf-ifailis `/etc/mongodb.conf`:

```
security:
   authorization: enabled
``` 

ja käivita andmebaas uuesti (`&` on käivitamine taustaprotsessina):

`mongod --config /etc/mongod.conf &`

Veendu protsessi tekkimises: `jobs`

Ühendu CLI `mongo` abil uuesti andmebaasi külge, seekord kasutajana `userAdmin`:

```
mongo --port 27017 -u "userAdmin" -p "changeit" --authenticationDatabase "admin"
```

või pärast `mongo` käivitamist:

```
use admin
db.auth( "userAdmin", "changeit" )
```

Kontrolli, et konto on õigesti loodud:

```
show users
```

Loo kasutaja `rakendus`

`use users`

```
db.createUser(
  {
    user: "rakendus",
    pwd: "changeit",
    roles: [ { role: "readWrite", db: "logibaas" } ]
  }
)
```

NB! Väärtused nagu `readWrite` on tõstutundlikud.
{: .adv}

Loo kasutaja `andmehaldur`

`use users`

```
db.createUser(
  {
    user: "andmehaldur",
    pwd: "changeit",
    roles: [ { role: "readWrite", db: "logibaas" } ]
  }
)
```

Kontrolli, et kontod on õigesti loodud:

```
use users
show users
```
### 3.5 Paigalda Node.js

Paigalda Node.js (viimane stabiilne versioon).

Vajadusel vt: [How To Set Up a Node.js Application for Production on Ubuntu 16.04](https://www.digitalocean.com/community/tutorials/how-to-set-up-a-node-js-application-for-production-on-ubuntu-16-04)

Väldi Ubuntu Node.js paketi paigaldamist (`sudo apt-get install nodejs`). Vt ja järgi  [Installing Node.js Tutorial: Ubuntu](https://nodesource.com/blog/installing-node-js-tutorial-ubuntu/).
{: .adv}

`curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -`

Seejärel:

`sudo apt-get install -y nodejs`

Kontrolli: `nodejs -v`

Kontrolli, et ka Node.js paketihaldur npm on paigaldatud: `npm --version` 

**Paigalda Node.js teegid**. Node.js vajab tööks rida Javascipti teeke. Need on kirjeldatud failis `package.json`. Teegid tuleb paigaldada kausta `node_modules`. Kui repo ei sisalda teeke, siis tuleb need paigaldada eraldi, Node.js paketihalduri `npm` abil.

Kui Node.js paigaldada Node.js ametlikult veebilehelt, siis npm paigaldatakse koos Node.js-ga. Kui Node.js paigaldada apt-get repo kaudu, siis tuleb npm eraldi paigaldada: `sudo apt-get install npm`.
{: .note} 

Alternatiiv on paigaldada teegid repo kaudu.
{: .note}

Liigu kausta `TARA-Stat`

`npm install <moodul> --save`

Paigaldada tuleb järgmised moodulid: `body-parser`, `ejs`, `express`, `mongodb`, `request`, `basic-auth` ja `request-debug`.

### 3.6 Seadista TARA-Stat veebirakendus

**Genereeri ja paigalda veebirakenduse HTTPS võtmed**. Moodusta kausta `TARA-Stat` alla alamkaust `keys`:

```
mkdir keys
cd keys
```

Genereeri võtmed:

`openssl genrsa -out tara-stat.key 2048`

`openssl req -new -x509 -key tara-stat.key -out tara-stat.cert -days 3650 -subj /CN=tara-stat`

Veendu, et failid `tara-stat.cert` ja `tara-stat.key` on veebirakenduse juurkausta alamkaustas `keys`.

Ava kaustas `TARA-Stat` asuv fail TARA-Stat konf-ifail `config.js` ja sea vajadusel õigeks failide `tara-stat.cert` ja `tara-stat.key` asukohad. (Kui vaikimisi peaksid olema Windows-i failiteed, siis kommenteeri need välja).

Arvesta, et Ubuntu server keskkonnas ei tarvitse kasutajate kaust `home` olla juurkausta, vaid nt `/opt` all.
{: .adv}

Kui veebirakenduses kasutada self-signed serti, siis hakkab kasutaja sirvik andma teadet "vigane turvasertifikaat". Teatest saab üle, kui kasutaja lisab erandi.
{: .adv}

Vajadusel vt: [Node 10.0 TLS](https://nodejs.org/api/tls.html#tls_tls_ssl_concepts); [Self-Signed, Trusted Certificates for Node.js & Express.js](https://www.kevinleary.net/self-signed-trusted-certificates-node-js-express-js/)

**Loo VM kasutaja `tarastat`**. Kasutaja `tarastat` on piiratud õigustega kasutaja, kelle alt käivitatakse TARA-Stat veebirakendus. Loo kasutaja:

`sudo adduser tarastat`

TODO Õiguste andmine ja määramine Node.js protsessiomanikuks.

**Loo usaldus TARA-Serveri ja TARA-Stat-i vahel**.

1\. Genereeri API-võti. Juhusõne pikkusega 20 tärki.

2\. Paigalda API-võti TARA-Stat-i konf-i. Ava fail `config.js` ja vaheta väärtus `changeit` õige vastu.

Alternatiiv on API-võti anda veebirakenduse käivitamisel parameetrina (`process.env`).

3\. Paigalda API-võti TARA-Stat poole pöörduva rakenduse (TARA-Server) konf-i.

### 3.7 Seadista VM tulemüür

Sea pääsureeglid VM tulemüüris. Vaja on:

- HTTPS päringud TARA-Server-lt
- HTTPS päringud Statistikakasutajalt (pöördub sirvikuga)
- HTTPS päringud monitooringulahenduselt (kui kasutatakse).

MongoDB osas vt: [How to Install MongoDB on Ubuntu 16.04](https://www.digitalocean.com/community/tutorials/how-to-install-mongodb-on-ubuntu-16-04), Step 3.

Sea pääsureeglid VLAN-is ja/või sisevõrgu ruuteri(te)s).

### 3.8 Paigalda Node.js protsessihaldur PM2

Node.js toodangukeskkonnas haldamiseks on hea praktika kasutada protsessihaldurit PM2

Vt:
- [PM2](https://www.npmjs.com/package/pm2) (npm)
- [How To Set Up a Node.js Application for Production on Ubuntu 16.04](https://www.digitalocean.com/community/tutorials/how-to-set-up-a-node-js-application-for-production-on-ubuntu-16-04)

Paigalda pm2:

`sudo npm install -g pm2`

Genereeri pm2 automaatkäivituse skript:

`pm2 startup systemd`

Täida eelmise käsu väljundi viimane rida (sellega luuakse systemd unit, millega pm2 automaatkäivitatakse).

Rakenduse käivitamine:

`pm2 start index`

Vaata pm2-ga hallatavate rakenduste nimekirja:

`pm2 list`

### 3.9 Tarkvara uuendamine

TARA-Stat tarkvara täiendamisel ei ole alati vaja paigaldust täies ulatuses korrata. Toimimisviis sõltub konkreetse täienduse olemusest. Kirjeldame mõned tüüpilised käsud, millest tarkvara uuendamisel võib kasu olla.

**Värskenda koodirepot**. Lähteolukord: täiendatud kood on lähterepos (GitHub-is või organisatsiooni siserepos. Täiendused on vaja paigaldada VM-i.

- Liigu VM-s kausta `TARA-Stat`.
- Kontrolli, et VM git repo on seotud lähterepoga: `git remote -v`
- Kui muutsid VM repos midagi ja tahad, et lähterepost tulev kirjutab sinu muudatused üle, siis anna: `git checkout .`
- Värskenda: `git pull origin master`

Kui VM ei tunnista git repo serti, siis kontrolli, kas VM kell on õige: `date`. Põhjus võib olla see, et NTP pole sees. Vajadusel paigalda NTP: `sudo apt-get install ntp`.
{: .adv}

## 4 Käitamine

### 4.1 Käivitamine

Eeldus: Node.js ja MongoDB on paigaldatud ja seadistatud.
{: .adv}

#### 4.1.1 MongoDB käivitamine

MongoDB tuleks käivitada teenusena (deemonina). Selleks määra MongoDB VM-i käivitamisel automaatselt käivitatavaks:

`sudo systemctl enable mongod`

Käivita teenus:

`sudo systemctl start mongod`

_Testimise eesmärgil võib MongoDB käivitada ka terminalist lahtiseotud taustaprotsessina. Vajalik on näidata konf-ifail:_

`mongod --config /etc/mongod.conf &`

_MongoDB võib käivitada ka terminaliga seotult (ilma &-ta), siis MongoDB vastab diagnostiliste teadetega ja lõpuks: `[initandlisten] waiting for connections on port 27017`._

#### 4.1.2 TARA-Stat veebirakenduse käivitamine

Käivita enne logibaas (MongoDB). Muidu teatab veebirakendus, et logibaasiga ei saa ühendust.
{: .adv}

**Käivitamine protsessihalduri pm2 abil**. Liigu veebirakenduse juurkausta `TARA-Stat` ja sisesta:

pm2 start index.js

**Testimise eesmärgil** võib TARA-Stat veebirakenduse käivitada ka terminalist lahtiseotud taustaprotsessina. Liigu veebirakenduse juurkausta `TARA-Stat` ja sisesta:

`nodejs index &`

Veebirakendus teatab:

`--- TARA-Stat kuulab pordil: 5000`

Kontrolli, et andmebaas ja veebirakendus töötavad:

`ps`

### 4.2 Statistika väljastamise otspunkti töötamise test

Pöördu teisest arvutist (kas Windows-host-st või teisest VM-st) veebirakenduse statistika väljastamise otspunkti poole. Järgnevas eeldame näitena, et masina, kuhu TARA-Stat paigaldati, IP-aadress on `192.168.56.101` ja TARA-Stat veebiteenuse port on `5000`. Ava sirvikus:

```
https://192.168.56.101:5000
```

Sirvik ütleb, et `Your connection is not secure`. See on selle tõttu,et veebirakendusel on _self-signed_ sert. Aktsepteeri erand.

Voilà!

<p style='text-align:center;'><img src='img/VOILA.PNG' width= "650"></p>

Miks tabelis ei ole statistikat? Sest logibaas on tühi.

### 4.3 Seiskamine

Logibaasi seiskamine:

`sudo systemctl stop mongod`

Veebirakenduse seiskamine:

`pm2 stop index`

### 4.4 Veateated

kood | veateade | vea lahendamise soovitus
ERR-01 | Logibaasiga ühendumine ebaõnnestus | Kontrollida, kas MongoDB töötab
ERR-02 | Viga logibaasist lugemisel | Kontrollida, kas MongoDB töötab
ERR-03 | Valesti moodustatud logikirje | Kontrollida logikirje saatmist TARA-Serveris
ERR-04 | Logibaasi poole pöörduja autentimine ebaõnnestus | Kontrollida API kasutajanime ja võtit

### 4.5 Käivitamine ja seiskamine skriptiga

**Käivitamisskript** `TARA-Stat-kaivita.sh` laseb käima logibaasi (MongoDB) ja TARA-Stat veebirakenduse (Node.js).

**Seiskamisskript** `TARA-Stat-seiska.sh` seiskab logibaasi (MongoDB) ja TARA-Stat veebirakenduse (Node.js).

## 5 Arendamine

### 5.1 Arendamine Windows-masinas

Arendamisel Windows-masinas on järgmised erisused.

Kõik komponendid (veebirakendus, logibaas, sirvik) on ühes masinas.

MongoDB paigaldamine

- Lisada path-i `C:\Program Files\MongoDB\Server\3.6\bin`
  - Vihje: `Search`, `envir` -> `Edit environmental variables`
- Paigalduse kontroll: `mongod --version`.
- MongoDB vajab kausta andmete hoidmiseks. Loo kaust `C:\data\db`.

MongoDB käivitamine

- `"C:\Program Files\MongoDB\Server\3.6\bin\mongod.exe"`
- path-i seadmise järel lihtsalt: `mongod`

MongoDB seadistamine
- ei ole vajalik, kui andmebaasi poole pöördumisi mitte autentida
- autentimise lisamiseks loo konfifail `C:\data\mongod.conf`.
- lisa:

```
security:
   authorization: enabled
```   

- konfifaili loomise järel käivita: `mongod --config C:\data\mongod.conf` 

Node.js paigaldamine

- Lisa path-i: `C:\Program Files\nodejs\`
- Konrolli paigaldust: `node -v`

Veebirakenduse käivitamine
- veebirakenduse juurkaustas: `node index`.

### 5.2 Testimine (käsitsi, lokaalses masinas)

Veebirakenduse käivitumise kontroll:

`https://localhost`

Logikirje lisamist saab testida nt [httpie](https://httpie.org/) abil (näites nii logikirje lisamise API kasutajanimi kui ka API-võti on `changeit`):

`http -a changeit:changeit POST :443 aeg=2018-04-29T00:00:30 klient=e-teenusA meetod=mobileID`

### 5.3 Testimine makettrakendusega

Tarkvara koosseisus on logikirjete lisamise otspunkti testimise
makettrakendus. Makettrakendus genereerib logikirjeid ja lisab need logibaasi. Makettrakenduse kood asub TARA-Stat repos failis `mockup.js`. Makettrakendus vajab tööks Node.js-i.

**Seadistamine**. Seadista makettrakendust parameetrite muutmisega failis `mockup-config` või parameetrite andmisega käivitamise käsurealt (`process.env`). Seadistada tuleb:
- TARA-Stat logikirje lisamise otspunkti URL
- nimetatud otspunkti pääsemiseks vajalik API kasutajanimi
- ja salasõna (API võti).

**Paigaldamine**. Makettrakendust võib käitada ka TARA-Stat-ga ühes masinas, eraldi Node.js instantsis. Kindlam on siiski testida paigaldamisega eraldi masinasse:

1\. Valmista VM ja paigalda Ubuntu.

2\. Paigalda Node.js ja npm:

Vt jaotis 3.3 Node.js.

3\. Paigalda TARA-Stat kood:

`git clone https://github.com/e-gov/TARA-Stat`

Järgnevas eeldame, et TARA-Stat asub kaustas `~/TARA-Stat`.

4\. Paigalda Node.js teegid

Liigu TARA-Stat juurkausta:

`cd ~/TARA-Stat`

Makettrakendus vajab ainult teeki `request`. Paigalda:

`npm install request --save`

5\. Selgita välja TARA-Stat logikirje lisamise otspunkti URL, API kasutajanimi ja salasõna.

Testimisel VirtualBox VM-des arvesta, et VM-dele antakse IP-d dünaamiliselt (alates `192.168.56.101`-st).
{: .note} 

6\. Veendu, et (teises masinas) TARA-Stat töötab.

7\. Liigu kausta `TARA-Stat`. Käivita makettrakendus (taristuparameetrid on näitlikud):

```
TARASTATURL='https://192.168.56.102:5000' \
TARASTATUSER='changeit' \
TARASTATSECRET='changeit' \
nodejs mockup 
```

Makettrakendus genereerib logikirjeid ja saadab logibaasi. Jälgi teateid, mida makett konsoolile väljastab.

Logikirjete genereerimise ja logibaasi saatmise järel lõpetab makettrakendus töö.

TARA-Stat statistikakasutaja UI kaudu või TARA-Stat veebirakenduse logist saad kontrollida, et saadetud kirjed tõesti salvestati logibaasi.

## 6 Joonised

### 6.1 TARA-Stat üldistatud arhitektuur

<p style='text-align:center;'><img src='img/Arhi.PNG' width= "500"></p>

### 6.2 Statistikakasutaja UI

<p style='text-align:center;'><img src='img/Capture.PNG' width= "650"></p>

### 6.3 Testimine arendusmasinas

<p style='text-align:center;'><img src='img/TEST-01.PNG' width= "500"></p>

## 7 Kasulikku

**MongoDB**, "a document database with the scalability and flexibility that you want with the querying and indexing that you need"

- [docs](https://docs.mongodb.com/)

**MongoDB server**

- käivitamine: `mongod`
- vaikimisi teenindab pordil `27017`.
- rakendus suhtleb MongoDB-ga TCP/IP socket-i põhise [MongoDB wire protocol](https://docs.mongodb.com/manual/reference/mongodb-wire-protocol/)-iga.
- MongoDB standardne pääsumehhanism - [Salted Challenge Response Authentication Mechanism](https://docs.mongodb.com/manual/core/authentication-mechanisms/).

**mongo**, "an interactive JavaScript shell interface to MongoDB"

- [ülevaade](https://docs.mongodb.com/manual/mongo/)
- [Reference](https://docs.mongodb.com/manual/reference/program/mongo/#bin.mongo)
- käivitamine ja sisselogimine kasutajana `userAdmin`:

```
mongo
use admin
db.auth("userAdmin", "changeit")
```

**MongoDB Compass**, "The GUI for MongoDB.", "The Easiest Way to Explore and Manipulate Your MongoDB Data."

- [juhend](https://docs.mongodb.com/compass/current/)

**MongoDB Node.js Driver**

- [ülevaade](http://mongodb.github.io/node-mongodb-native/?jmp=docs&_ga=2.138292915.2088530382.1524857109-302204577.1524857109)
- [dok-n](http://mongodb.github.io/node-mongodb-native/3.0/)
- [Aggregation Pipeline](https://docs.mongodb.com/manual/core/aggregation-pipeline/)
- [Using the Aggregation Framework](http://mongodb.github.io/node-mongodb-native/2.0/tutorials/aggregation/)

**ejs**, "Effective JavaScript templating"

- [docs](http://ejs.co/)
- [Syntax Reference](https://github.com/mde/ejs/blob/master/docs/syntax.md)

[httpie](https://httpie.org/), "a command line HTTP client with an intuitive UI, JSON support, syntax highlighting"

**Bash**, skriptikeel 

- [Linux Shell Scripting Tutorial (LSST) v2.0](https://bash.cyberciti.biz/guide/Main_Page)
- [väike teatmik](https://e-gov.github.io/TARA-Stat/Bash)
- [Index of Linux Commands](http://www.linfo.org/command_index.html)