#!/bin/bash

# TARA-Stat-genereeri-votmed.sh
#
# Genereeri TARA-Stat veebirakenduse HTTPS privaatvõti ja sert
#

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
echo " --- Genereerin TARA-Stat veebirakenduse HTTPS privaatvõtme ja serdi"
echo
kasJatkan

# ------------------------------
# 1. Kui paigaldaja soovib, siis genereeritakse võtmepaar ja sert
#
cd /opt/TARA-Stat
mkdir keys
cd keys

openssl genrsa -out tara-stat.key 2048
openssl req -new -x509 -key tara-stat.key -out tara-stat.cert -days 3650 -subj /CN=tara-stat

echo Veendu, et failid tara-stat.cert ja tara-stat.key moodustati
echo
ls -l

lopeta