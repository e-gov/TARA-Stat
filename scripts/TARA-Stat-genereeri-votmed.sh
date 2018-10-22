#!/bin/bash

# TARA-Stat-genereeri-votmed.sh
#
# Genereeri TARA-Stat veebirakenduse:
# 1) HTTPS Serveri privaatvõti ja sert (self-signed)
# 2) TCP TLS Serveri privaatvõti ja sert (self-signed)
#

# ------------------------------
# Abistaja: Väljasta lõputeade ja välju
#
function lopeta {
  echo
  echo " --- Võtmete genereerimise LÕPP"
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
echo " --- Genereerin TARA-Stat veebirakenduse HTTPS Serveri"
echo "     ja TCP TLS Serveri privaatvõtmed ja serdid (self-signed)"
echo
kasJatkan

# ------------------------------
# 1. Kui paigaldaja soovib, siis genereeritakse võtmepaar ja sert
#
cd /opt/TARA-Stat
mkdir keys
cd keys

# HTTPS Serveri võtmepaar ja sert
openssl genrsa -out tara-stat-https.key 2048
openssl req -new -x509 \
  -key tara-stat-https.key \
  -out tara-stat-https.cert \
  -days 3650 \
  -subj /CN=tara-stat

# TCP TLS Serveri võtmepaar ja sert
openssl genrsa -out tara-stat-tcp-tls.key 2048
openssl req -new -x509 \
  -key tara-stat-tcp-tls.key \
  -out tara-stat-tcp-tls.cert \
  -days 3650 \
  -subj /CN=tara-stat

echo Veendu, et failid moodustati
echo
ls -l

lopeta