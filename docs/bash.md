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
