---
permalink: Bash
---

# Bash

- **shebang**
  - `#!/bin/bash` (näitab, millist programmi skripti täitmiseks kasutada)

- **kommentaar**
  - `#`

- **Suunamine** - `>` failide ühendamine, nt `stdout` ühendada `stdin`-ga
  - `stdout` suunamine faili: `ls -l > ls-1.txt`
  - **failideskriptorid** - `stdin`, `stdout`, `stderr`
  - `1` tähistab `stdout`, `2` tähistab `stderr`

- **Toru**
  - `|` - ühendus protsesside vahel

- **Muutujad**
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

- **Käsu väljundi haaramine**
  - `$(date +%Y%m%d)` - täidab käsu ja haarab väljundi
  - väljundi saab omistada muutujale: `myvar=$( ls /etc | wc -l )` (failide arv kaustas)

- **Tingimuslause**
  - `if [ "foo" = "foo" ]; then
       ...
     fi`
  - `else`, `else if`

- **Funktsioonid**
  - `function nimi { kood }`
  - parameetri poole pöördumine: `$1` - esimene parameeter
  - väljakutsumine parameetriga: `fnimi param`

- **Menüü**
  - `OPTIONS="Hello Quit"
      select opt in $OPTIONS; do
        if [ "$opt" = "Quit" ]; then
          echo done
          exit
        elif [ "$opt" = "Hello" ]; then`  

- **Sagelikasutatavad käsud**
  - `echo`

- **Jutumärgid**
  - _Single quotes will treat every character literally_
  - Jutumärgid lubavad viiteid muutujatele

- **Skripti täitmine**
  - `./` - jooksvas kaustas oleva skripti täitmine

- **Kasutaja sisend**
  - `read NAME` (mitu muutujat eralda tühikutega)

- **Aritmeetika**
  - `echo $((1+1))` või `echo $[1+1]`

- **Faili allalaadimine internetist**
  - `wget -O failinimi "URL"` (paneb jooksvasse kausta)  
  - nt `wget -O code_1.23.0-1525361119_amd64.deb "https://go.microsoft.com/fwlink/?LinkID=760868"
`
- **Kontrolli, kas pakett on paigaldatud**
  - `dpkg -l paketinimi`

- **Paigaldatud paketi eemaldamine**
  - `sudo apt-get remove rakendusenimi`

- **nano, tekstiredaktor**
  - [koduleht](https://www.nano-editor.org/)
  - `sudo nano failinimi`

- **Otsimine**
  - `sudo find / -type f -name "failinimi" (otsib üle kogu ketta konkreetse nimega faile)

- **Terminalist lahtisidumine**
  - ` &` (käsu lõpus, käivitatav protsess seotakse terminalist lahti ja hakkab jooksma taustal)

- **Protsesside seisund**
  - `ps` (jooksva kasutaja jooksva terminaliga seotud protsessid)
  - `ps aux` (kõik protsessid)
  - `ps -ejH`

- **Õigused failisüsteemis**
  - `chmod` (õiguste muutmine)
    - `-R` (rekursiivseltsud)
    - `sudo chmod -R ug+rw /var/lib/mongodb` (user ja group-le lisada read ja write õigused)
  - `chown` (omanduse muutmine)  

- **sudo**
  - prefiks, millega saab käsu täita peakasutaja (_root_) õigustes (sudo õiguse olemasolul)



## Märkmed

- `sudo apt-get install libxss1 libasound2`
- `sudo apt-get install libgtk2.0-0`
- vt https://github.com/Microsoft/vscode/issues/13089
- [Ubuntu tekstiredaktorite ülevaade](http://www.informit.com/articles/article.aspx?p=1670957&seqNum=3)
- `sudo apt-get install apt-transport-https`


