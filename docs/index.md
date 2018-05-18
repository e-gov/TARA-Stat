
<p style='text-align:right;'><i>Do one thing and do it well</i> &mdash; <a href='https://en.wikipedia.org/wiki/Unix_philosophy' target='_new'>Unix_philosophy</a></p>

# Mikroteenusarhitektuurist
{: .no_toc}

Priit Parmakson

Käesoleval kirjutisel on kolm osa. Esimeses osas arutlen küsimuste üle, mis mikroteenuste (µT) arhitektuuris praktikas olulised. Tuleb tõdeda, et paljudele küsimustele ei ole veel selgeid vastuseid.

Teises osas on ühe konkreetse mikroteenuse kirjeldus.

Kolmandas osas püüan kinni püüda ideid mikroteenusarhitektuuri juurutamiseks.

Lisas pakun välja µT dokumentatsioonimalli. 

## Sisukord
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
{: .note}

Sõltuvuseks võib olla ka liiga keerukas arendusprotsess.
{: .note}

Miks see on oluline? Kuigi µT on äravisatavad ja ümberkirjutatavad, on siiski kasulik neid aeg-ajalt täiendada. µT arendus ei tohiks olla pidev. Kergem on meelde tuletada ja muuta koodi, mis on kirjutatud laialt levinud keeles.

**Ühte kasulikku funktsiooni täitev**. Ühe funktsiooni tõttu langevad ära või lihtsustuvad mitmed monoliitarenduses palju aega ja energiat nõudvad tööd. Vaja ei ole spetsiaalset süsteemi kasutusjuhtude kirjelduste haldamiseks - kasutusjuhtusid ongi 2-3. 

### 1.3 7 päeva

µT peaks olema (ümber-)kirjutatav u nädalaga.
{: .note}

Milliste tööde ja toimingute vahel see aeg jaguneb? Koodi kirjutamine on ainult osa arendusest. Arendust mõistame siin DevOps vaatenurgast. S.t arendus on kõik see, mis ei ole teenuse käitamine. Arendamine on ka tarkvara paigaldamine. Planeerin järgmise ajakava:

päev    | töö                | tulemus  | edenemine   |
--------|--------------------|----------|:-----------:|
1\.     | arenduskeskkonna ülesseadmine,<br> koodi kirjutamine  | repo loodud, teegid ja tehnoloogiad valitud, vähemalt üks otspunkt teostatud | OK |
2\.     | koodi kirjutamine (jätk) | kõik otspunktid teostatud, äriloogika põhiosas teostatud (v.a nt turvakontrollid); arendaja masinas töötab; testitud käsitsi | OK |
3\.     | API spetsifikatsiooni jm dokumentatsiooni kirjutamine | µT API ja muu dok-n koostatud ja rahuldavas seisus | OK |
4\.     | paigaldusprotsessi ja -plaani koostamine, paralleelselt tarkvara viimistlemine, eriti turvalisuse tõstmise seisukohalt (_hardening_) | paigaldusplaan | OK |
5\.     | testpaigalduse läbitegemine; paralleelselt tarkvara viimistlemine, eriti turvalisuse tõstmise seisukohalt (_hardening_) | paigaldamine läbi mängitud | OK |
6\.     | toodangusse paigaldamine, klientide teavitamine | µT on kasutusvalmis; klientidele on teenust esitletud | OK |
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

Eespool sai märgitud, et isoleerimine ei saa kunagi olla täielik. (Krüptograafia terminites - mingi kõrvalkanal (_side channel_) jääb alati). Seetõttu tuleb arvestada, et ka suhteliselt madala ohuprofiiliga µT, olles IT-taristu üks osa, võib potentsiaalselt - kui turve jäetakse hooletusse - mõjutada teisi, hoopis tähtsamaid süsteeme.

Peamised põhjused on vajadus takistada võimaliku ründaja edasipääs teistesse süsteemidesse, samuti takistada tõrgete levik taristu teistesse osadesse.

Ründajal ei tohi olla võimalus kasutada rakendust lävepakuna IT-taristu teistesse osadesse.
{: .note}

Rakenduse võimalike tõrgete levik IT-taristu teistesse osadesse peab olema tõkestatud.
{: .note}

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
{: .note}

Võrgu tasandil saab samuti autentida, kontrollides teise osapoole IP-aadressi. Kuid  tavaliselt ei loeta seda piisavaks. Osapoole (siis rakenduse) IP ei tarvise olla piisavalt püsiv. Samuti peetakse IP-aadresside võltsimist (_IP spoofing_) teatavaks ohuks.

Kokkuvõttes, autentimine on alati kulu. Sellest kulust saab vabaneda ainult siis, kui autentimine pole vajalik s.t teenust saab osutada anonüümsele kasutajale. Pääsu piiramise vajadus võib siiski olla ka anonüümteenuse korral. Sellest järgmistes jaotistes.

#### 1.5.4 Võrgule avatuse piiramine

Üks peaeesmärke on **piirata võrgule avatust** (_network exposure_). Selleks tehakse seadistustoiminguid võrguseadmetes, võrku ühendatud masinates ja võrgutarkvaras.

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
{: .note}

#### 1.5.6 Ühendamine

Eraldamine ei ole siiski kunagi absoluutne. Veebisirviku näites oleksid veebilehed väga primitiivsed kui veebileht suhtleks ainult oma serveripoolega. **Ühendamine* on isoleerimise vastandprotsess. Koos moodustavad need dialektilise terviku, omamoodi yingi ja yangi. Samas sirvikus töötavate veebirakenduste ühendamiseks ongi loodud erinevaid võimalusi: allikavaheline ressursijagamine, _cross origin resouce sharing_ (_CORS_), `postMessage` API, vanematest JSONP.

#### 1.5.7 Transpordi turvamine

Monoliitrakenduses ei ole komponentidevahelise andmeedastuse turvamine probleem. Üks Java meetod kutsub välja teist. Kõik see toimub Java virtuaalmasina (JVM) sees. Eeldame, et JVM-s keegi pealt ei kuula ega vahele ei sekku. _That's it_. µT-sed aga on paigaldatud igaüks eraldi ja seetõttu peavad suhtlema üle vähem või rohkem ebaturvalise võrgu.

µT peaks suhtlema turvatud protokolli kaudu. Levinuim protokolli selles suhtluses on HTTP. 

µT-l peaks olema HTTPS võimekus.
{: .note}

#### 1.5.8 Tundliku taristuteabe ja saladuste kaitse

Avaarenduse (_open source_) kasud on nii arvukad ja suured, et tänapäeval avaarendus peaks olema eelistatud arendusmudel. Siiski on avaarenduses teavet, millele juurdepääsu on vaja piirata. Teavet võib liigitada:

- avalik arendusteave
- tundlik arendusteave (siin seotud taristu kaitse vajadustega)
- salajane arendusteave (saladused).

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

Praktikas tuleb arvestada, et süsteem peab olema ka kasutatav. Samuti, turvameetmete rakendamise eelarve ei ole piiramatu. Olulised on järgmised elemendid:

- avalik kood ja dokumentatsioon, tundlik taristuteave ja saladused hoitakse eraldi
- erinevate eesmärkidega paigaldusi (arendus, testimine, toodang) tehakse kombineerides avalikku koodi, tundlikku taristuteavet ja saladusi 
- kõik ei saa olla tundlik; kõik ei saa olla salajane
- tundlikust taristuteabest ja saladustest on selge ülevaade
- avalikus koodis ja dokumentatsioonis on tundlikud taristuparameetrid ja saladused asendatud näiteväärtustega, nt `changeit`.
- näiteväärtusi ei kasutata toodangus
- tundlik taristuteave on organisatsiooni siserepos (dokumendi- v koodirepos või mõlemas)
- saladuste hoidmiseks on oma kord ja tehniline lahendus.

| samm             | avaliku, tundliku ja salajase teabe kasutus |
|------------------|-----------------------------------------|
| avalik testimine | avalik kood (GitHub), sh näiteväärtused |
| sisemine testimine | avalik kood, konf-tud tundlike taristuparameetritega; saladusteks näiteväärtused |
| toodang | avalik kood (siserepost), konfitud tundlike taristuparameetritega ja saladustega |

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

## 2. TARA-Stat

TARA-Stat on eksperimentaalne µT [autentimisteenuse TARA](https://e-gov.github.io/TARA-Doku) kasutusstatistika tootmiseks ja vaatamiseks.

TARA-Stat tootmisdokumentatsiooniga saab tutvuda: [https://e-gov.github.io/TARA-Stat/Dokumentatsioon](https://e-gov.github.io/TARA-Stat/Dokumentatsioon).

### 2.1 Funktsioon

TARA-Stat pakub:

- võimalust autentimisteenuses fikseeritud autentimistoimingute logimiseks, hilisema statistikaarvutamise tarbeks
- võimalust logi põhjal lihtsa - kuid autentimisteenuse haldamiseks vajaliku - statistika arvutamiseks ja vaatamiseks

Eelkõige huvitab autentimiste arv klientrakenduste lõikes ajaperioodil.

TARA-Stat kasutajaliides statistikakasutajale:

<p style='text-align:center;'><img src='img/Capture.PNG' width= "650" style='border: 1px solid black;'></p>

Ongi kõik. Kohe tekib küsimus, kas seda pole liiga vähe? See µT on spetsialiseeritud logi. Logimine on ulatuslik teema. Logitakse mitmel erineval eesmärgil - turvamine, kasutajate pöördumiste lahendamine, teenuse ülaloleku seiramine jm. Autentimisteenuses TARA on juba oma, keerukas logilahendus - mis on (potentsiaalselt) ühendatud võimsa keskse logisüsteemiga. Kas siis eraldi, spetsialiseeritud logilahendusel on mõtet? See on mittetriviaalne, kuid väga oluline küsimus. Eraldi logilahendusel puuduks mõte, kui olemasolev võimas, väga paindlik ja paljude omadustega, _out-of-the-box_ logisüsteem oleks seadistatav vajaduse lahendamiseks vähema ajaga kui kulub µT arendamiseks. Praktika näitab siiski, et võimsate universaallahenduste tundmaõppimine ja seadistamine võib olla väga töömahukas. Ise tehes saame teha täpselt selle mida vajame - täpselt nii nagu tahame. Küsimusele kumb on parem - kas ise tehtud µT või seadistatud võimas universaalne vahend - ei ole universaalset vastust. Ise põlve otsas tegemine nõuab oskusi ja on kahtlemata riskantne. Kuid reaalsed riskid on ka suurte universaalsete valmislahenduste puhul. Näeme ju praktikas ikka ja jälle, kuidas majja tuuakse ilus ja võimas raamistik, meetod või keel, kuid selle juurutamine võtab aastaid ning suur osa vahendi võimalustest jäävad kasutamata. Igal juhul oleme µT puhul oma kahjusid tõkestanud - äraviskamisel kaotame maksimaalselt ühe nädala töö. Kui arvestada õppimist, siis tõenäoliselt vähem.

µT peab täitma ühtainust ülesannet (millel võib olla mitu tahku v osaülesannet).
{: .note}

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
{: .note}

Ühe µT sisetehnoloogiad ei tohi mõjutada teise µT sisetehnoloogiate valikut.
{: .note}

Tehnoloogiate valimisel ei saa läbi katsetamiseta. Kulutasin omajagu aega [RESTHEart](http://restheart.org/) - MongoDB veebiliides s.o rakendus, mis ühendub MongoDB külge ja võimaldab REST API kaudu andmebaasi kasutada - uurimisele. Ühel hetkel sain aru, et lisalüli ei ole vaja ja lihtsam on  MongoDB veebiliides kirjutada ise, kasutades standardset MongoDB Node.js draiverit. (See on väga tüüpiline. Internetis pakutakse palju raamistikke, vahendeid jms, mis on ehitatud teise vahendi peale ning nagu pakuksid lisaväärtust. Arvestades, et iga vahendit tuleb tundma õppida ja häälestada, on tihti kasulik sellistest kahtlast lisaväärtust pakkuvatest vahekihtidest loobuda ja programmeerida ise, standardsete vahenditega.)

### 2.5 Töö jätkamine teise arendaja poolt

Kas teine arendaja saab tööd TARA-Stat-ga jätkata? Usun, et jah, saab - kui ta tunneb µT-ses kasutatud võtmetehnoloogiaid või on valmis neid õppima. Praegusel juhul MongoDB ja Node.js. (HTTP REST tundmist eeldan.) Koodi maht on väike - 200 LOC. See on kindlasti endale selgeks tehtav. Kasutatud on standardseid, laialt tuntud teeke. 

Kui arendaja peaks MongoDB või Node.js mitte tudnma ega soovi neid õppida, siis tuleb TARA-Stat kood ära visata ja rakendus ümber kirjutada. Näiteks PostgreSQL ja Java Spring kasutamisega. Koodi kirjutamiseks on kulutatud 1-2 päeva. Ümberkirjutamine teise keelde ei tohiks rohkem aega võtta.

Äravisatavus ja ümberkirjutatavus on µT tähtsamate omaduste hulgas.
{: .note}

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
{: .note}

µT suhtleb teiste masinatega, erinevate inimestega. Teenindab ja kasutab ise teenuseid. µT enda sees on üksteisega suhtlevad komponendid. Suhtlevaid osapooli on ka väikese rakenduse puhul paras hulk. Erinevatel osapooltel on erinevad õigused. Õigusi peab olema parasjagu: mitte liiga palju (ebaturvaline), mitte liiga vähe (ei pääse teenusele ligi). Osapooltel on **identiteedid** (nimed), mida tõendavad **kredentsiaalid** (paroolid, võtmed). Kõike seda on omajagu. Sellest peab olema ülevaade ja see peab olema tasakaalus. **Õiguste plaani** eesmärk on anda täpne pilt rakendusega seotud osapooltest, nende rollidest ja õigustest, samuti kredentsiaalidest.

TARA-Stat käitluskontekstis on 9 osapoolt (subjekti), kes vajavad identiteedi ja kredentsiaalide andmist ning õiguste seadmist:
{: .note}

TARA-Stat käitluskontekstis on 9 osapoolt (subjekti), kes vajavad identiteedi ja kredentsiaalide andmist ning õiguste seadmist.

| kasutaja vm õiguste subjekt (_principal_), masinloetava nimega | subjekti liik ja kirjeldus | kredentsiaalid |
|:--------:|:-------:|:--------------:|
| `admin` | Ubuntu kasutaja, kes paigaldab tarkvara ja teeb muid haldustoiminguid | salasõna |
| `tarastat` | Ubuntu kasutaja, kelle alt käivitatakse TARA-Stat veebirakendus | salasõna |
| `mongodb` | Ubuntu kasutaja, kelle alt käitatakse Mongo DB andmebaas | 
| `userAdmin` | MongoDB kasutaja, kes haldab MongoDB kasutajaid. Seda rolli täidab VM admin | salasõna |
| `rakendus` | TARA-Stat veebirakenduse konto MongoDB-s | salasõna |
| `andmehaldur` | MongoDB konto, mille alt kustutatakse aegunud logikirjeid. Andmehalduri rolli täidab VM admin | salasõna |
| `https://tara-stat.site` | TARA-Stat veebirakendus | _self-signed_ sert |
| - | statistikakasutaja - anonüümne inimene, kes pöördub sisevõrgust TARA-Stat veebirakenduse statistika väljastamise otspunkti poole | ei autendita, juurdepääs piiratakse kontekstiga |
| `tara-server` | TARA-Server, pöördub TARA-Stat logikirjete vastuvõtmise otspunkti poole | API kasutajanimi ja salasõna |

<p style='text-align:center;'><img src='img/IDENTITEET.PNG' width= "500"></p>

## 3 Liikumine mikroteenusarhitektuuri poole

**Sõltuvuste vähendamine** on tõenäoliselt perspektiivseim tee. Eespool (jaotises 1.2) oli juttu sõltuvustest - ja iseseisvusest kui µT määravast omadusest. Iseseisvus ja sõltuvus on vastandid.

## LISA. Mikroteenuse dokumentatsioonimall

Mikroteenuse dokumentatsioon peaks:
•	mahtuma ühte dokumenti
•	olema orieteeritud toodangusse viimisele ja käitamisele
•	olema kõigi jõududega hoitud ajakohane
•	ja sisaldama (teatud +/- -ga) järgmisi teemasid:

1. Funktsioon (soovitavalt 1-2, mitte rohkem)
2. Komponendid ja liidesed (sh ülevaatlik arhitektuurijoonis)
  sh liideste (API-de) spekid
3. Suhtluse osapooled (kõik, ka paigaldav süsadmin)
4. Turvamine (loetelu turvaotsustest. NB! Mitte ainult rakendatud meetmetest, vaid ka teadlikest valikutest mingit meedet mitte rakendada – põhjendusega)
5. Identiteedid ja kredentsiaalid (avalikus dokumendid näiteväärtused)
6. Sõltuvused (kõik olulised, päris detailselt; toodangu- ja arendussõltuvused eraldi)
7. Paigaldamine (juhised nii alg- kui uuenduspaigaldamisele, sh konfi-misest, paigaldusskriptide tutvustus)
8. Käivitamine, staatus ja seiskamine (kompaktne teave käitluse nende aspektide kohta)
9. Olulised asukohad (teatmikteave admin-le vm käitlejale)
10. Diagnostika (veateadete tabel koos soovitustega)
11. Logi (logide asukohad ja eesmärgid)
12. Testimine (fookusega sellele, et testiasjad ei läheks toodanguga segamini)
