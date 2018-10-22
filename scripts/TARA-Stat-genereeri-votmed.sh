#!/bin/bash

# TARA-Stat-genereeri-votmed.sh
#
# Genereeri TARA-Stat veebirakenduse:
# 1) HTTPS Serveri privaatvõti ja sert (self-signed)
# 2) TCP TLS Serveri privaatvõti ja sert (self-signed)
#

# Värvid
ORANGE='\033[0;33m'
NC='\033[0m' # No Color

# ------------------------------
# Abistaja: Väljasta lõputeade ja välju
#
function lopeta {
  echo
  echo -e "${ORANGE} --- Võtmete genereerimise LÕPP ${NC}"
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
echo -e "${ORANGE} --- Genereerin TARA-Stat veebirakenduse HTTPS Serveri ${NC}"
echo -e "${ORANGE}     ja TCP TLS Serveri privaatvõtmed ja serdid (self-signed) ${NC}"
echo
kasJatkan

# ------------------------------
# 1. Kui paigaldaja soovib, siis genereeritakse võtmepaar ja sert
#
cd /opt/TARA-Stat
mkdir keys
cd keys

# HTTPS Serveri võtmepaar ja sert
openssl genrsa -out https.key 2048
openssl req -new -x509 \
  -key https.key \
  -out https.cert \
  -days 3650 \
  -subj /CN=tara-stat

# TCP TLS Serveri võtmepaar ja sert
openssl genrsa -out tcp-tls.key 2048
openssl req -new -x509 \
  -key tcp-tls.key \
  -out tcp-tls.cert \
  -days 3650 \
  -subj /CN=tara-stat

echo Veendu, et failid moodustati
echo
ls -l

lopeta