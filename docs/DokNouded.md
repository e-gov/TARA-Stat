---
permalink: DokNouded
layout: TARA
---

# Mooduli dokumenteerimise nõuded
{: .no_toc}

## Sisukord
{: .no_toc}

- TOC
{:toc}

Käesolev dokument loetleb ja selgitab nõudeid mooduli dokumenteerimisele.

Sihtrühm: arenduste tellijad, arendajad.

**Moodul** on süsteemi koosseisus töötav, kuid eraldi arendatav, testitav ja paigaldatav tarkvara. Moodul töötab süsteemis ühe või mitme protsessina. Moodulil võib olla omaette andmebaas, logid, seadistusfailid. Moodul suhtleb teiste moodulitega, teenustega, masin- ja inimkasutajatega. Moodul osutab ise ja kasutab teisi teenuseid.

Siin sõnastatud nõuded on üldistus konkreetses moodulis  [TARA-Stat](https://e-gov.github.io/TARA-Stat/Dokumentatsioon) järeleproovitud praktikast.

**Kood** on masina poolt täidetav programmitekst.

**Dokumentatsioon** on koodi juurde kuuluv inimloetav kirjeldus tarkvara omaduste kohta.

**Mooduli kasutusdokumentatsioon** on inimloetav, süstematiseeritud teave, millest lugeja saab: 1) ülevaate tarkvara eesmärgist, ülesehitusest ja tööpõhimõttest; 2) juhised tarkvara paigaldamiseks, seadistamiseks, käitamiseks ja kasutamiseks.

Kasutusdokumentatsiooni sihtrühmaks on tarkvara paigaldaja, haldaja, edasiarendaja ja lõppkasutaja abipöördumiste käsitleja.

Kasutusdokumentatsioon ei esita arenduse ajalugu. Analüüsid, teekaardid, arendusettepanekute (GitHub _issues_) ja arendustaskide sõnastused, _backlog_-id, tööde raportid jms on väga olulised, kuid ei ole kasutusdokumentatsiooni skoobis.

Kasutusdokumentatsioon on eelkõige suunatud valmis mooduli kasutamisele. Kuid kasutusdokumentatsioon on ka eelduseks tarkvara edasiarendatavusele teise arendaja poolt. 

**Dokumentatsiooni avalikkus ja kaitse**. Tundlikkuse (_confidentiality_) poolest eristame: 1) avalikku koodi ja dokumentatsiooni; 2) taristutundlikku teavet; 3) saladusi (_secret_).

Tuleb eeldada, et kood on avalik. Kui kood ei ole veel avalikult välja pandud, siis võidakse seda teha. Ründaja võimet ligi pääseda koodile tuleb eeldada.

Taristutundlik teave on: 1) masinanimed, pordid, protokollid, IP aadressid, mis ei ole avalikkusele mõeldud. Siia kuuluvad ka isikuandmed, mille teadmisvajadust avalikkusel ei ole.

Saladused on privaatvõtmed ja salasõnad.

Vastavalt tundlikkusele tuleb korraldada teabe hoidmine.

Kui võimalik, hoitakse koodi ja dokumentatsiooni koos, ühes ja samas repos. Kui see ei taga dokumentatsiooni kasutatavust, siis hoitakse dokumentatsiooni täiendavalt organisatsiooni teabesüsteemis (nt Confluence).

Dokumentatsioonile tuleb rakendada versiooniohjet (s.t muudatuste ajalugu peab olema jälgitav). Arenduse käigus tekib märkmeid, mis ei oma püsivat väärtust. Sellisele teabele ei rakendada versiooniohjet. Versiooniohjet ei võimalda nt GitHub wiki. Seetõttu GitHub wiki on sobiv märkmete, kuid mitte stabiilse dokumentatsiooni hoidmiseks.

**Avarepos** on tarkvara kood ja avalik dokumentatsioon. Taristutundliku teabe ja saladuste sattumist avareposse tuleb vältida.

Selleks tuleb seadistuse (konfiguratsiooni) hoidmiseks kasutada **sise- e mitteavalikku repot** või reposid.

Saladuste genereerimine ja hoidmine peab olema täiesti eraldi protsess. Arenduses ja testimises tuleb kasutada vastavaid arendus- ja testimiseesmärgilisi saladusi. Nende käsitlemine peab olema tootmise saladustest nii protsessi kui ka asukohtade poolest täiesti eraldi. 

Moodul on otstarbekas dokumenteerida ühe dokumendiga. Dokumentatsiooni osaks on ka koodis olevad kommentaarid. Järgnevalt loetleme küsimused ja aspektid, millele mooduli dokumentatsioon peab vastused andma. 

**ülevaade**

  - dokumendi eesmärk, käsitlusala (skoop) ja sihtrühm
  - tähistused. Taristutundlikust teabest rääkides tuleb avadokumentatsioonis kasutada näiteväärtusi.

**mooduli eesmärk v ülesanne**. Mis teenust moodul pakub?

**arhitektuurijoonis**. Arhitektuurijoonisel tuleb näidata: 1) moodul ja selle ümbrus; 2) mooduli peamised sisekomponendid; 3) mooduli kõik liidesed; 4) liidestes kasutatavad protokollid; 5) mooduli teenuste kasutajad - inimkasutajad rollide kaupa; masinkasutajad süsteemide või masinate nimedega; 6) info liikumise peamised suunad. Avadokumentatsiooni arhitektuurijoonisel ei esitada tundlikku evitusteavet. Kui moodulit on võimalik paigaldada mitmel viisil, siis näidata peamine või üldistatud viis.

**kasutajaliidese ülevaade**. Kasutajaliidese peamiste kuvade skeemid v pildistused

**mooduli komponentide loetelu**, koos selgitusega, mida iga komponent teeb

**liideste loetelu**, koos selgitusega iga liidese otstarbe kohta

**kasutajad** mooduli kõigi kasutajate (nii inim- kui ka masinkasutajad) loetelu (rollide kaupa)

**liideste spetsifikatsioonid**. Kõik mooduli poolt pakutavad masinliidesed (API-d) tuleb spetsifitseerida, otspunktide, päringutes ja vastuste liikuvate andmeformaatide täpsusega. Suurema API puhul kasutada formaalset kirjeldust (HTTP puhul OpenAPI e Swagger). Tähelepanu pöörata vastuskoodide kirjeldamisele. Mooduli siseliideste kirjeldamisel on nõuded nõrgemad. Siseliideste loogika, otspunktide, päringu- ja vastusevormingute spetsifikatsiooniks võib olla kood ise. Eraldi dokumendi puhul lisada viide.

**salvestatavate andmete vormingud**, sõltuvalt sellest, kas ja millist salvestustehnoloogiat (SQL või NoSQL andmebaasi, failisüsteemi vms) moodul kasutab.

**võtmete ja salasõnade tüübid**

**olulised asukohad** e "kiiresti leitav". Teatmik, millega probleemi korral saab kiiresti ülevaate kaustade struktuuris, logi- ja seadistusfailide asukohtadest jms.

**sõltuvused**. Loetelu: 1) tehnoloogiatest, mida moodul oma keskkonnas eeldab; 2) moodulis kasutatud teekidest; 3) moodulist kasutatud tehnoloogiatest (programmeerimiskeel jms). Eraldi välja tuua tootmis- ja arendussõltuvused. Sõltuvus versioonist. Sõltuvusteave on (mitte täielikult) masinloetaval kujul paketeerimisfailis (Maven POM fail, Node.js `package.json` vms). Selle teabe dubleerimine ja ajakohasena hoidmine võib olla problemaatiline. Kuid oluline tuleb dokumentatsioonis välja tuua.

**konfigureerimise (seadistamise) ülevaade**. Millised konf-ifailid on kasutusel ja kus nad asuvad. Konf-ifaile hoida eraldi, mitteavalikus repos. Avarepos võivad olla konf-ifailide näidised (selgelt märgistatud).

**ülevaade paigaldamise ja seadistamise käigust**.

**ülevaade juurdepääsudest**, mis moodulile ja mooduli kasutajatele tuleb avada

**käivitamine ja seiskamine**. Kuidas rakendust (kui moodul koosneb mitmetest protsessidest v rakendustest, siis rakendusi) käivitada ja seisma panna.

**juhis mooduli ühendamiseks monitooringuga** (seiresüsteemiga)

**logimise kirjeldus**. Märkus. TARA-Stat-is TODO.

**diagnostikajuhis**. Siin anda nõuanded rakenduse seisundi väljaselgitamiseks, tõrgete ja probleemi uurimiseks. See teaveloomulikult ei saa olla ammendav.

**rakenduse haldamistööde juhised**. Haldamistööde all peame silmas toiminguid, mis ei ole automatiseeritud, vaid rakenduse haldur peab neid käsitsi tegema. Näiteks aegunud teabe kõrvaldamine (kui see ei ole automatiseeritud). Käsitsitoimingute juhised peavad olema detailsed ja täpsed. Eeldame, et rakendushaldur ei tarvitse tarkvara siseehitust tunda ja haldustoiminguga on kiire.

**kasutajaliidese kasutamise juhis**. Suure kasutajaliidese juhul võib olla vaja eraldi vormistatud juhendit.

**testimise käsitlus**. Vähemalt ülevaade mooduli juurde käivast testikomplektist, makettrakendustest vms.

**infoturbe käsitlus**. Loetelu moodulis rakendatud olulisematest turvameetmetest (kõike ei jõua loetleda), eelkõige tarkvaratehnilistest. Konkreetsed evitusega seotud turvameetmed ei kuulu avadokumentatsioonis käsitlemisele. Organisatsioonilisi turvameetmeid käsitleda abstraktsel tasemel. Eraldi kategooriatena väärivad käsitlemist: 1) juurdepääsu kaitse; 2) andmetranspordi kaitse; 3) sisendi kaitse.

**käideldavus**. Kas moodul on kasutatav klastris? Kas on nõutav konkreetne koormusjaotus- v sünkroonimistarkvara?

**veateated**. Mooduli poolt väljastatavate veateadete täielik loetelu koos nõuannetega vea kõrvaldamiseks.

Koodi dokumenteerimine. Iga mittetriviaalse funktsiooni (funktsioonipõhise programmeerimiskeele korral) või klassi ja meetodi (objekt-orienteeritud programmeerimiskeele korral) päises peab olema inimloetav lühikirjeldus funktsiooni, klassi või meetodi ülesande, sisend- ja väljundparameetrite kohta. Suure mooduli korral on vajalik Javadoc vms koodi dokumumentatsiooni genereerimise vahend.

Priit Parmakson, 18.01.2019




 