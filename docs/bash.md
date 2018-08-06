---
permalink: BASH
layout: TARA
---

# Bash-i, ühtlasi ka Linux-i ja OpenSSL-i meelespea
{: .no_toc}

- TOC
{:toc}

## Aritmeetika

`echo $((1+1))`

`echo $[1+1]`

# Kaustad ja failid

`wget -O failinimi "URL"` (faili allalaadimine internetist; paneb jooksvasse kausta)

`cp <source> <dest-n>` (kopeerimine)

`mv <vana> <uus>` (ümbernimetamine)

`pwd` (jooksev kaust)

`ls -a -l` # sisu, sh peidetud failide kuvamine

`ll` # (eelmise alias)

`rm -R <nimi>` # kustutamine, rekursiivselt

`sudo find / -type f -name "failinimi"` (otsib üle kogu ketta konkreetse nimega faile)

`scp kasutaja@host:/opt/kasutaja/tee/failinimi C:/TÖÖS` # (faili kopeerimine lokaalsesse masinasse SSH abil (secure copy))

# Juhtimisstruktuurid

`if [ "foo" = "foo" ]; then` (if-lause algus)

`fi` (if-lause lõpp)

`else`, `else if`

`function <nimi> { <kood> }` (funktsiooni deklareerimine)

`<fnimi> <param>` (funktsiooni väljakutsumine parameetriga)

`$1` (parameetri poole pöördumine funktsioonis; esimene parameeter)

# Jutumärgid
- _Single quotes will treat every character literally_
- Jutumärgid lubavad viiteid muutujatele

# Kasutaja

`sudo adduser <nimi>` (lisamine)

`sudo deluser <nimi>` (kustutamine)

`sudo deluser --remove-home <nimi>` (kodukausta kustutamisega)

`su <nimi>` (vaheta kasutajat, vahetamata kausta)

`su - <nimi>` (vaheta kasutajat, liigud uude kodukausta)

`exit` (tagasilülitumine eelmisele kasutajale)

`su -c 'mongod --config /etc/mongod.conf &' - mongodb` (kasutaja nimel käsu täitmine; vt [su kirjeldus](http://www.linfo.org/su.html)

`sudo <käsk>` (käsu täitmine peakasutajana)

`ls /etc/sudoers` (sudo-poliitika konf-ifail)

`find /var -user <kasutajanimi>` (kasutajale kuuluvad failid kaustas /var)

`find /data/project -group ftpusers -name "*.c"` (grupile kuuluvad failid kaustas, mustri järgi)

# Kasutaja sisend

`read NAME` # (mitu muutujat eralda tühikutega)

`read -p "Paigaldada (y/n)? " answer`


# Käsu väljundi haaramine

`$(date +%Y%m%d)` # täidab käsu ja haarab väljundi

väljundi saab omistada muutujale:

`myvar=$( ls /etc | wc -l )` (failide arv kaustas)

`echo` # kuvamine terminalile

# Menüü
```
OPTIONS="Hello Quit"
select opt in $OPTIONS; do
  if [ "$opt" = "Quit" ]; then
    echo done
    exit
  elif [ "$opt" = "Hello" ]; then 
```

# Muutujad

`STR="Hello!"` (defineerimine (nimed tühikuta ja tõstutundlikud!))

`echo $STR` (kasutamine) 

`if [ "$T1" = "$T2" ]; then` (võrdlustes) 

`local STR=Hello` (lokaalne m-ja (funktsioonis)) 

`$0` (skripti nimi)

`$1` (parameetri nimi)

`$#` (mitu parameetrit anti)

`$?` (viimase protsessi staatus)

`$USER` (skripti täitva kasutaja nimi)

`$PATH` (keskkonnamuutuja PATH (kaustad eraldatud :-ga))

`$HOSTNAME` (masina nimi)

`$LINENO` (jooksva rea nr)

`env` (näitab keskkonnamuutujaid)

`export var1` + `./script2.sh` (eksportimine: muutuja var1 antakse skriptile parameetriks)      

# nano, tekstiredaktor

[koduleht](https://www.nano-editor.org/)

`sudo nano <failinimi>`

`nano -Ynone -m <failinimi>` (käivita süntaksivärvimiseta ja hiire toega)

`Alt+A ... Ctrl+K -> Ctrl+U` (lõika ja aseta)

`Alt+A ... Alt+6` (kopeeri)

# openSSL

`openssl x509 -in <serdifail>.pem -noout -text` # (kuvab serdi sisu)

`openssl s_client -host HOSTNAME -port PORT` # (kuvab serdiahela)

`openssl s_client -connect HOSTNAME:PORT -showcerts`

`openssl pkcs12 -export -out certificate.pfx -inkey tara-stat.key -in tara-stat.cert -certfile intermediate.pem` # (loob pfx-faili)

vt: https://www.openssl.org/docs/manmaster/man1/pkcs12.html

# Paketihaldus

`dpkg` - Debian Package Manager

`apt` - Advanced Package Tool. Kasutab sisemist andmebaasi

`apt-cache` - käsureavahend apt puhvriga tutvumiseks

`apt-cache pkgnames` (kuva saadaolevate pakettide nimed)

`apt-cache pkgnames <nimealgus>` (kuva stringiga algava nimega paketid)

`apt-cache search <paketinimi>` (kuva paketi lühikirjeldus)

`apt-cache show <paketinimi>` (kuva paketi kirjeldus)

`apt-cache showpkg <paketinimi>` (kuva sõltuvate pakettide seis)

`dpkg -l <paketinimi>` (kontrolli, kas pakett on paigaldatud)

`sudo apt-get remove <rakendusenimi>` (paigaldatud paketi eemaldamine)

`which nodejs` (paketi või rakenduse asukoha otsimine)

# Paroolihaldus

`passwd` (oma parooli vahetamine)

`sudo passwd <kasutaja>` (teise kasutaja parooli vahetamine)

`cat /etc/passwd | grep <kasutajanimi>` (kasutaja kirje kuvamine)  

# Protsessid

`kill -s 15 <pid>` (lõpetab protsessi, saates signaali _terminate_ (15))

`ps` (jooksva kasutaja jooksva terminaliga seotud protsessid)

`ps aux` (kõik protsessid)

`ps -ejH` (protsessipuu)

`netstat --listen` (kes millist porti kuulab)

`sudo netstat -peanut | grep ":5000"` (protsess, mis kuulab porti 5000)

`ps aux | grep "mongo"` (protsess)

# Skriptid

`#!/bin/bash` (näitab, millist programmi skripti täitmiseks kasutada)

`./skript.sh` (täidab jooksvas kaustas oleva skripti)

`sudo bash skript.sh` (täidab skripti root-na)

`sudo` (prefiks, millega saab käsu täita peakasutaja (_root_) õigustes (sudo õiguse olemasolul))

# Suunamine ja ühendamine

nt stdout ühendada stdin-ga

`stdin`, `stdout`, `stderr` (failideskriptorid; 1. positsioonil stdout, 2. - stderr)

`ls -l > ls-1.txt` (stdout suunamine faili) 

`<<EOF` (sisendi suunamine käsule, [kirjeldus](https://superuser.com/questions/1003760/what-does-eof-do))

`|` (toru - ühendus protsesside vahel)

# sed, striimiredaktor

`sed -i 's/authorization: disabled/authorization: enabled/' /etc/mongod.conf`
([sed juhend](https://www.gnu.org/software/sed/manual/sed.html))

# Terminalist lahtisidumine

`&` (käsu lõpus, käivitatav protsess seotakse terminalist lahti ja hakkab jooksma taustal)

`nohu <käsk>` (_no hangup_)



# Võrguühendused

vt [iproute2](https://en.wikipedia.org/wiki/Iproute2)

`netstat -plntu` (loetelu kuulajatest: protokoll, IP, port)

# Õigused failisüsteemis

`chmod` (õiguste muutmine)

`-R` (rekursiivselt)

`sudo chmod -R ug+rw /var/lib/mongodb` (user ja group-le lisada read ja write õigused)

`sudo chmod +x kaivita.sh` (käivitusõiguse andmine failile)

`sudo chown kasutaja fail` (seab kasutaja faili omanikuks) 

# systemd, rakenduste haldussüsteem

`systemctl` - teenuste haldusvahend, osa `systemd` haldussüsteemist. Vt [How To Use Systemctl to Manage Systemd Services and Units](https://www.digitalocean.com/community/tutorials/how-to-use-systemctl-to-manage-systemd-services-and-units)

`sudo systemctl start nimi` (käivita teenus nimi)

`stop`, `restart`

`reload` (loeb uuesti konf-ifail, kui on suuteline)

`reload-or-restart` (emb-kumb)

`enable` (määrab VM käivitamisel automaatselt käivitatavaks)

`disable`

`systemctl status <üksus>` (kuva üksuse staatus)

`is-active`, `is-enabled`, `is-failed`

haldusüksus (unit): v.o `installed` -> `loaded` -> `active` -> `running`

`list-units *pm2*.service` (kuva üksused mustri järgi)

`systemctl list-units --type=service` (aktiivsed teenused)

`/lib/systemd/system` (haldusüksuste kirjeldusfailide kaust)

# Märkmed

- [Manual Work is a Bug](https://queue.acm.org/detail.cfm?id=3197520)
- [Ubuntu tekstiredaktorite ülevaade](http://www.informit.com/articles/article.aspx?p=1670957&seqNum=3)

