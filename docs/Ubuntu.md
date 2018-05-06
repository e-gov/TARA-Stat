---
permalink: Ubuntu
---

# Ubuntu abi
{: .no_toc}

- TOC
{:toc}

Käesolev abitekst käsitleb Linux Ubuntu virtuaalmasina (VM) loomist Windows-arvutis ja selle sisustamist töövahenditega.

**Oracle Virtualbox**  on virtualiseerimisvahend, millega saab oma arvutis luua ja käitada virtuaalmasinaid. Vt:

- [Virtualbox User Manual](http://www.virtualbox.org/manual/)
- [https://www.virtualbox.org/](https://www.virtualbox.org/)

**Ubuntu** on Linuxi distributsioon, mis kasutab Debiani paketihaldust ja on kasutamise lihtsustamiseks teinud kindla programmide valiku: üks aknahaldur – GNOME, üks veebilehitseja – Firefox, üks meiliprogramm – Thunderbird jne. -- [Vikipeedia](https://et.wikipedia.org/wiki/Ubuntu).

Linuxi kohta vt nt:

- Machtelt Garrels (2008) [Introduction to Linux](https://www.tldp.org/LDP/intro-linux/html/intro-linux.html)
- [Linux Documentation Project](https://www.tldp.org/guides.html) teised juhendid

## Oracle Virtualbox-i paigaldamine

Paigaldab süsteemiadministraator. Kasutajale saab Windows-is kättesaadavaks virtuaalmasinahaldur (Oracle Virtualbox VM Manager).

## Virtuaalmasinahalduri kasutamine

- Ubuntu virtuaalmasina loomine: `File`, `New` TODO detailid!
- VM OS-i tõmmise tõmbamine internetist Windows-masinasse: nt `ubuntu-16.04.4-desktop-amd64` kaustas `Downloads` 
- VM esmakordne käivitamine: `Start`, näidata OS-i tõmmise asukoht. OS paigaldatakse VM-sse.
- Hetktõmmise tegemine: `Take`

## Ubuntu Desktop

Ubuntu Desktop koosneb käivitusribast (Launcher) ja akende alast. Käivitusribal on kasulíkke tööriistu nagu:
- `Search`
- `Files` - failihaldur
- `Terminal`
- `System Settings` (Ubuntu Desktop-i seadistused. Virtualbox-i seadistused vt `File`, `Preferences` ja VM seadistused `Machine`, `Settings`)
- `Firefox`

Sageli kasutatavad tööriistad ja programmid on mõtet lisada käivitusribale (`Lock to Launcher`).

## Kopeerimine ja asetamine

... on Linux VM-s Windows-masinaga võrreldes piiratum. Seadistamisvõimalusi on -  `Machine`, `Settings`, `General`, `Advanced`, `Shared Clipboard`, `Bidirectional`, kuid need on keerulised ja ka siis kõik ei tööta. Enamasti töötab parem hiireklõps + `Copy` v `Paste`.

Töötab aknavahetus: `Alt`+`Tab`.

## Mittevajaliku eemaldamine

Failihalduri (`Files`) abil võib kasutajakaustast (`home`) eemaldada mittevajalikud kaustad nagu Music jms.

`Ubuntu Software` > `Installed` > `Remove` abil saab vabaneda mittevajalikest tarkvaradest nagu mängud, soovi korral ka Libre jms.

Ubuntu Desktop Käivitusribalt saab `System Settings`, `Appearance`, `Background` abil vahetada töölaua taustavärvi.

VM kuvalukku (kui host-i kuvalukust piisab) saad seadistada `System Settings`, `Brightness & Lock`.

## Täiendamine töövahenditega

Vajadused ja eelistused on individuaalsed. Tarkvara (pakette) paigaldamise vahend on `apt` ([Advance Package Tool](https://en.wikipedia.org/wiki/APT_(Debian))), seda käivitatakse admini õigustes (_superuser do_). Nt curl-i paigaldamine:

`sudo apt-get install curl`

Paigaldatud pakettide nimekiri: `apt list --installed`.

Pakutavate pakettide nimekirja uuendamine: `sudo apt-get update`

Mõned tarkvarad paigaldatakse mitmes sammus: 1) internetist laetakse alla Debian-i pakett (`.deb`); 2) see paigaldatakse Debian-i paketihalduri `dpkg` abil; 3) lõplik paigaldamine `apt-get` abil.

- `dpkg -l` - paigaldatud pakettide nimekiri
- `dpkg -i <file>.deb` - paigalda pakett

Nt: [Visual Studio Code paigaldamine](https://code.visualstudio.com/docs/setup/linux). Visual Studio Code on koodiredaktor (IDE), mis sobib eriti Javascripti (Node.js) ökosüsteemis kasutamiseks. 

Visual Studio Code käivitamine: `code`

[Git-i paigaldamine](https://www.liquidweb.com/kb/install-git-ubuntu-16-04-lts/): 

- `sudo apt-get install git-core`
- kontrolli: `git --version`
- sea git-i vaikimisi kasutaja:

```
git config --global user.name "testuser"
git config --global user.email "testuser@example.com"
```

- kontrolli: `git config --list`.

Push-sel parooliküsimise vältimine: `git config credential.helper store`

## Pääsuõigused

Töö toimub tavalise kasutajana (_non-root user_), kellel on `sudo` õigused (õigus anda käske admin-na). Tavalise kasutaja loomine: `adduser <nimi>`.

Kasutajale sudo-õiguste andmine: `usermode -aG sudo <kasutaja>`.

## Võrguühendused

VM-le võib seadistada ühe või mitu võrguadapterit. Seda tehakse virtuaalmasinahalduris: `Settings`, `Network`, valida adapter ja seadistada.

**NAT võrguadapter**. Lihtsaim võrguadapter on nn `NAT` tüüpi. See võimaldab VM-st pööduda internetti.

**Host-only võrguadapter**. Kui soovid mõlemapidist pöördumisvõimalust VM ja host-arvuti (_host_) vahel, siis lisa teine adapter, tüüpiga `Host-only`. Hosti jaoks on VM IP `192.168.56.101` (dünaamiline IP, vaata, milline see on, `ifconfig` abil VM-s, `ipconfig` abil Windows-is). Nüüd saad VM-s üles panna veebiserveri ja pöörduda selle poole host-st.

Vt. [Accessing your Virtualbox Guest from your Host OS](https://gist.github.com/odan/48fc744434ec6566ca9f7a993f4a7ffb).

## Pöördumine host-i kaustada poole

Virtuaalmasinahalduris: `Settings`, `Shared folders`, `Machine folders`, `+` ja vali host-i kaust.
