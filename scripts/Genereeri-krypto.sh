#!/bin/bash

# TARA-Stat-genereeri-votmed.sh
#
# Genereeri TARA-Stat testimiseks vajalik krüptomaterjal.
# 
# 1) Genereeri CA
# 1) HTTPS Serveri privaatvõti ja sert (self-signed)
# 2) TCP TLS Serveri privaatvõti ja sert (self-signed)
# 3) TCP TLS Testkliendi privaatvõti ja sert (self-signed)
#
# Krüptomaterjal luuakse kausta: /opt/keys

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
echo -e "${ORANGE} --- Genereerin TARA-Stat testimiseks vajaliku krüptomaterjali"
echo -e "1) CA privaatvõtme ja serdi"
echo -e "2) HTTPS Serveri privaatvõtme, serdi ja pfx-faili "
echo -e "3) TCP TLS Serveri privaatvõtme, serdi ja pfx-faili"
echo -e "4) TCP TLS Testkliendi privaatvõtme, serdi ja pfx-faili"
echo -e "Krüptomaterjal moodustatakse kausta /opt/keys. ${NC}"
echo
kasJatkan

# ------------------------------
# 1. Liigu kausta /opt/keys
#
cd /opt
mkdir keys
cd keys

# ------------------------------
# 2. Genereeri CA privaatvõti ja sert
#
echo
echo -e "${ORANGE} --- Genereerin CA privaatvõtme ja serdi ${NC}"
echo
openssl req -new -x509 \
  -days 9999 \
  -keyout ca-key.pem \
  -out ca-crt.pem

# ------------------------------
# 3. Genereeri HTTPS Serveri privaatvõti, sert ja pfx-fail
#
echo
echo -e "${ORANGE} --- Genereerin HTTPS Serveri privaatvõtme, serdi ja pfx-faili ${NC}"
echo
# Genereeri võtmepaar
openssl genrsa \
  -out https.key 2048
# Genereeri serdiallkirjastamispäring
openssl req -new \
  -key https.key \
  -out https-csr.pem
# Allkirjasta sert  
openssl x509 -req \
  -days 3650 \
  -in https-csr.pem \
  -CA ca-crt.pem \
  -CAkey ca-key.pem \
  -CAcreateserial \
  -out https-crt.pem
# Moodusta pfx-fail
openssl pkcs12 -export \
  -out https.pfx \
  -inkey https.key \
  -in https.cert \
  -certfile ca-crt.pem

echo Veendu, et failid moodustati
echo
ls -l

lopeta