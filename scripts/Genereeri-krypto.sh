#!/bin/bash

# Genereeri-krypto.sh
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
  echo -e "${ORANGE} --- Võtmete genereerimise LÕPP ${NC}"
  exit
}

# ------------------------------
# Abistaja: Küsin kasutajalt kas jätkata
#
function kasJatkan {
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
# Genereeri Serveri privaatvõti, sert ja pfx-fail
# Parameetrid: $1 - subjekti nimi, $2 - failinimi
#
function genereeriKomplekt {
echo -e "${ORANGE} --- Genereerin $1 privaatvõtme, serdi ja pfx-faili ${NC}"
# Genereeri võtmepaar
openssl genrsa \
  -out $2.key 2048
# Genereeri serdiallkirjastamispäring
openssl req -new \
  -key $2.key \
  -out $2.csr
# Allkirjasta sert  
openssl x509 -req \
  -days 3650 \
  -in $2.csr \
  -CA ca.cert \
  -CAkey ca.key \
  -CAcreateserial \
  -out $2.cert
# Moodusta pfx-fail
openssl pkcs12 -export \
  -out $2.pfx \
  -inkey $2.key \
  -in $2.cert \
  -certfile ca.cert
}

# ------------------------------
# 1. Liigu kausta /opt/keys
#
cd /opt
mkdir keys
cd keys

# ------------------------------
# 2. Genereeri CA privaatvõti ja sert
#
echo -e "${ORANGE} --- Genereerin CA privaatvõtme ja serdi ${NC}"
openssl req -new -x509 \
  -days 9999 \
  -keyout ca.key \
  -out ca.cert

genereeriKomplekt "HTTPS Server" "https"
genereeriKomplekt "TCP TLS Server" "tcp-tls"
genereeriKomplekt "TCP TLS Testklient" "tcp-tls-test"

echo -e "${ORANGE} Veendu, et failid moodustati ${NC}"
ls -l

echo
echo -e "${ORANGE} Pfx-faili saad kontrollida käsuga "
echo -e "openssl pkcs12 -info -in fail.pfx ${NC}"
echo

lopeta