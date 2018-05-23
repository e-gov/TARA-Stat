#!/bin/bash

# TARA-Stat-paigalda-votmed.sh
#
# TARA-Stat veebirakenduse HTTPS privaatvõtme ja serdi paigaldamine
#
# Eeldus: rakenduse repo, sh config.js on kopeeritud VM-sse.
# 
# 1. Paigaldaja teatab võtmete kausta
# 2. Võtmete kausta nimi märgitakse config.js-i
# 3. Kui paigaldaja soovib, siis genereeritakse võtmepaar ja sert
# 4. Vastasel korral palutakse paigaldajal kontrollida, et 
#    privaatvõti ja sert on võtmete kaustas 

# ------------------------------
# Abistaja: Väljasta lõputeade ja välju
#
function lopeta {
  echo
  echo " --- Võtmete paigaldamise LÕPP"
  echo
  exit
}

# ------------------------------
# Abistaja: Küsin kasutajalt kas jätkata
#
function kasJatkan {
  echo
  read -p " --- Jätkata (y/n)? " prompt
  if [[ $prompt != y && $prompt != Y ]]
  then
    lopeta
  fi
  echo
}

# 0. Kontrollküsimus
echo
echo " --- Paigaldan TARA-Stat veebirakenduse HTTPS privaatvõtme ja serdi"
echo
kasJatkan

# ------------------------------
# 1. Paigaldaja teatab võtmete kausta
#
read -p "Sisesta võtmete kausta nimi (võib olla suhteline TARA-Stat suhtes)" keydir

# ------------------------------
# 2. Võtmete kausta nimi märgitakse config.js-i
#
sed -i "s/KEYDIR-changeit/$keydir/" /opt/TARA-Stat/config.js

# ------------------------------
# 3. Kui paigaldaja soovib, siis genereeritakse võtmepaar ja sert
#
read -p "Kas genereerida võtmed ja self-signed sert (y/n)?" vastus
if [[ $prompt != y && $prompt != Y ]]
then
  # Genereeri
  cd /opt/TARA-Stat
  mkdir $keydir
  cd $keydir

  openssl genrsa -out tara-stat.key 2048
  openssl req -new -x509 -key tara-stat.key -out tara-stat.cert -days 3650 -subj /CN=tara-stat

  echo Veendu, et failid tara-stat.cert ja tara-stat.key moodustati
  echo
  ls -l
else
  # 4. Vastasel korral palutakse paigaldajal kontrollida, et 
  #    privaatvõti ja sert on võtmete kaustas 
  echo "Kontrolli, et oled failid tara-stat.cert ja tara-stat.key paigaldanud võtmete kausta $keydir"
  echo
fi 

lopeta