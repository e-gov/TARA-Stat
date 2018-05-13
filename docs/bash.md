---
permalink: Bash
---

# Bash

- **aritmeetika**
  - `echo $((1+1))` või `echo $[1+1]`

- **faili allalaadimine internetist**
  - `wget -O failinimi "URL"` (paneb jooksvasse kausta)  
  - nt `wget -O code_1.23.0-1525361119_amd64.deb "https://go.microsoft.com/fwlink/?LinkID=760868"
`
- **funktsioonid**
  - `function nimi { kood }`
  - parameetri poole pöördumine: `$1` - esimene parameeter
  - väljakutsumine parameetriga: `fnimi param`

- **jooksev kaust**
  - `pwd`

- **jutumärgid**
  - _Single quotes will treat every character literally_
  - Jutumärgid lubavad viiteid muutujatele

- **kasutaja**
  - `sudo adduser nimi` (lisamine)
  - `sudo deluser nimi` (kustutamine)
  - `sudo deluser --remove-home nimi` (kodukausta kustutamisega)
  - **vahetamine**
    - `su nimi` (vaheta kasutajat, vahetamata kausta)
    - `su - nimi` (vaheta kasutajat, liigud uue kodukausta)
    - `exit` (tagasilülitumine eelmisele kasutajale)
  - **kasutaja nimel käsu täitmine**
    - `su -c 'mongod --config /etc/mongod.conf &' - mongodb`
    - vt [su kirjeldus](http://www.linfo.org/su.html)
  - **superuser**, peakasutaja
    - `sudo käsk` (käsu täitmine peakasutajana)
    - konf-ifail `/etc/sudoers`
  - **omandis failid**
    - `find /var -user nimi` (kasutaja `nimi` failid kaustas `/var`)
    - `find /data/project -group ftpusers -name "*.c` (grupile kuuluvad failid kaustas, mustri järgi)

- **kasutaja sisend**
  - `read NAME` (mitu muutujat eralda tühikutega)
  - `read -p "Paigaldada (y/n)? " answer`

- **kausta v faili kustutamine**
  - `rm -R nimi` (rekursiivselt)

- **kommentaar**
  - `#`

- **kontrolli, kas pakett on paigaldatud**
  - `dpkg -l paketinimi`

- **käsu väljundi haaramine**
  - `$(date +%Y%m%d)` - täidab käsu ja haarab väljundi
  - väljundi saab omistada muutujale: `myvar=$( ls /etc | wc -l )` (failide arv kaustas)

- **kuvamine terminalile**
  - `echo`

- **menüü**
  - `OPTIONS="Hello Quit"
      select opt in $OPTIONS; do
        if [ "$opt" = "Quit" ]; then
          echo done
          exit
        elif [ "$opt" = "Hello" ]; then`  

- **muutujad**
  - defineerimine: `STR="Hello!"` (tühikuta! tõstutundlikud!)
  - kasutamine: `echo $STR`
  - võrdlustes: `if [ "$T1" = "$T2" ]; then`
  - lokaalne m-ja (funktsioonis): `local STR=Hello`
  - **erimuutujad**
    - `$0` - skripti nimi
    - `$1` - parameetri nimi
    - `$#` - mitu parameetrit anti
    - `$?` - viimase protsessi staatus
    - `$USER` - skripti täitva kasutaja nimi
    - `$PATH` - keskkonnamuutuja PATH (kaustad eraldatud `:`-ga)
    - `$HOSTNAME` - masina nimi 
    - `$LINENO` - jooksva rea nr
    - käsk `env` näitab keskkonnamuutujaid 
  - **eksportimine**
    - `export var1
       ./script2.sh` (muutuja `var1` antakse skriptile parameetriks)       

- **nano**, tekstiredaktor
  - [koduleht](https://www.nano-editor.org/)
  - `sudo nano failinimi`
  - `nano -Ynone failinimi` (käivita süntaksivärvimiseta)

- **otsimine**
  - `sudo find / -type f -name "failinimi" (otsib üle kogu ketta konkreetse nimega faile)

- **paigaldatud paketi eemaldamine**
  - `sudo apt-get remove rakendusenimi`

- **parooli muutmine**
  - `passwd`
  - `/etc/passwd` [Vikipeedia](https://en.wikipedia.org/wiki/Passwd)  

- **programmi asukoha leidmine**
  - `which nimi`

- **protsessi lõpetamine**
  - `kill -s -15 <pid>` (lõpetab protsessi, saates signaali _terminate_ (15) 

- **protsesside seisund**
  - `ps` (jooksva kasutaja jooksva terminaliga seotud protsessid)
  - `ps aux` (kõik protsessid)
  - `ps -ejH` (protsessipuu)

- **shebang**
  - `#!/bin/bash` (näitab, millist programmi skripti täitmiseks kasutada)

- **skripti täitmine**
  - `./skript.sh` (täidab jooksvas kaustas oleva skripti)
  - `sudo bash skript.sh` (täidab skripti root-na)

- **sudo**
  - prefiks, millega saab käsu täita peakasutaja (_root_) õigustes (sudo õiguse olemasolul)

- **suunamine** - `>` failide ühendamine, nt `stdout` ühendada `stdin`-ga
  - `stdout` suunamine faili: `ls -l > ls-1.txt`
  - **failideskriptorid** - `stdin`, `stdout`, `stderr`
  - `1` tähistab `stdout`, `2` tähistab `stderr`
  - **<<EOF** (sisendi suunamine käsule)
    - [kirjeldus](https://superuser.com/questions/1003760/what-does-eof-do)

- **striimiredaktor**
  - `sed -i 's/authorization: disabled/authorization: enabled/' /etc/mongod.conf`
  - [sed juhend](https://www.gnu.org/software/sed/manual/sed.html)

- **systemctl**
  - teenuste haldusvahend, osa systemd haldussüsteemist
  - [How To Use Systemctl to Manage Systemd Services and Units](https://www.digitalocean.com/community/tutorials/how-to-use-systemctl-to-manage-systemd-services-and-units)
  - `sudo systemctl start nimi` (käivita teenus `nimi`)
  - `stop`, `restart`
  - `reload` (loeb uuesti konf-ifail, kui on suuteline)
  - `reload-or-restart` (emb-kumb)
  - `enable` (määrab VM käivitamisel automaatselt käivitatavaks)
  - `disable`
  - `status`
  - `is-active`, `is-enabled`, `is-failed`
  - `list-units`
  - `systemctl list-units --type=service` (aktiivsed teenused)

- **terminalist lahtisidumine**
  - ` &` (käsu lõpus, käivitatav protsess seotakse terminalist lahti ja hakkab jooksma taustal)
  - `nohu käsk` (_no hangup_)

- **tingimuslause**
  - `if [ "foo" = "foo" ]; then
       ...
     fi`
  - `else`, `else if`

- **toru**
  - `|` - ühendus protsesside vahel

- **võrguühendused**
  - [iproute2](https://en.wikipedia.org/wiki/Iproute2)
  - `netstat -plntu` (loetelu kuulajatest: protokoll, IP, port)

- **õigused failisüsteemis**
  - `chmod` (õiguste muutmine)
    - `-R` (rekursiivseltsud)
    - `sudo chmod -R ug+rw /var/lib/mongodb` (user ja group-le lisada read ja write õigused)
    - `sudo chmod +x kaivita.sh` (käivitusõiguse andmine failile)
  - `sudo chown kasutaja fail` (seab kasutaja faili omanikuks)  

## Märkmed

- [Manual Work is a Bug](https://queue.acm.org/detail.cfm?id=3197520)

- `sudo apt-get install libxss1 libasound2`
- `sudo apt-get install libgtk2.0-0`
- vt https://github.com/Microsoft/vscode/issues/13089
- [Ubuntu tekstiredaktorite ülevaade](http://www.informit.com/articles/article.aspx?p=1670957&seqNum=3)
- `sudo apt-get install apt-transport-https`
- https://stackoverflow.com/questions/15043606/change-user-mongod-is-running-under-in-ubuntu 
- http://www.codexpedia.com/devops/mongodb-authentication-setting/ 
