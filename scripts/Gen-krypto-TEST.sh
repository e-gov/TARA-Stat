#!/bin/bash

# Genereeri-krypto.sh
#
# Genereeri TARA-Stat testimiseks vajalik krüptomaterjal.
# 
# 1) CA (TEST) privaatvõti ja iseallkirjastatud sert
# 1) HTTPS serveri (TEST) privaatvõti ja CA poolt allkirjastatud sert
# 2) TLS serveri (TEST) privaatvõti ja CA poolt allkirjastatud sert
# 3) TLS kliendi (TEST) privaatvõti ja CA poolt allkirjastatud sert
# 4) TLS serveri (TEST) privaatvõti ja iseallkirjastatud sert
# 5) TLS kliendi (TEST) privaatvõti ja iseallkirjastatud sert
#
# Töötab nii Linux-is kui ka Windows-is.
# Op-süsteem näidatakse skripti käivitamisel.
# Windows-i puhul arvestada, et OpenSSL töötab seal mittetäielikult:
# salasõnade küsimisel jääb rippuma. Seetõttu salasõnad on skripti
# sisse kirjutatud.
#
# Krüptomaterjal luuakse:
# - Linux-i puhul kausta /opt/keys
# - Windows puhul jooksvasse kausta
#
# Käivitamine:
# - Linux: 
#    käivita suvalisest kaustast
# - Windows:
#    mine kausta TARA-Stat/keys-TEST
#    $ ./../scripts/Ge-krypto-TEST.sh

# Värvid
ORANGE='\033[0;33m'
NC='\033[0m' # No Color

CA_CERT='ca-TEST.cert'
CA_KEY='ca-TEST.key'

# ------------------------------
# Abistaja: Väljasta lõputeade ja välju
function lopeta {
  echo -e "${ORANGE} --- Võtmete genereerimise LÕPP ${NC}"
  exit
}

# ------------------------------
# Abistaja: Küsin kasutajalt kas jätkata
function kasJatkan {
  read -p " --- Jätkata (y/n)? " prompt
  if [[ $prompt != y && $prompt != Y ]]
  then
    lopeta
  fi
  echo
}

# 0. Op-süsteemi valimine
echo
echo -e "${ORANGE} --- Genereerin TARA-Stat testimiseks vajaliku krüptomaterjali"
echo -e "1) CA privaatvõtme ja serdi"
echo -e "2) HTTPS serveri (TEST) privaatvõtme, serdi ja pfx-faili "
echo -e "3) TLS serveri (TEST) privaatvõtme, serdi ja pfx-faili"
echo -e "4) TLS kliendi (TEST) privaatvõtme, serdi ja pfx-faili"
echo -e "Krüptomaterjal moodustatakse:"
echo -e "- Windows-is jooksvasse kausta"
echo -e "- Linux-is kausta /opt/keys. ${NC}"
echo

echo -e "${ORANGE} Vali platvorm ${NC}"
OPSYS_OPTIONS="Linux Windows Välju"
select OPSYS in $OPSYS_OPTIONS; do
  if [ "$OPSYS" = "Välju" ]; then
    lopeta
  elif [ "$OPSYS" = "Linux" ]; then
    OPSYS='Linux'
    break
  elif [ "$OPSYS" = "Windows" ]; then
    OPSYS='Windows'
    break
  fi
done

# ------------------------------
# Genereeri privaatvõti, sert ja pfx-fail
# Parameetrid:
# $1 - subjekti nimi
# $2 - failinimi
# $3 - serdi Subject
#
function genereeriKomplekt {
echo -e "${ORANGE} --- Genereerin $1 privaatvõtme, serdi ja pfx-faili ${NC}"
echo -e "${ORANGE} Genereerin võtmepaari ${NC}"
openssl genpkey \
  -out $2.key \
  -pass pass:changeit \
  -algorithm RSA \
  -pkeyopt rsa_keygen_bits:2048
echo -e "${ORANGE} Genereerin serdiallkirjastamispäringu ${NC}"
openssl req -new \
  -key $2.key \
  -out $2.csr \
  -subj $3 \
  -passout pass:changeit
echo -e "${ORANGE} Allkirjastan serdi ${NC}"
openssl x509 \
  -req \
  -days 3650 \
  -in $2.csr \
  -CA $CA_CERT \
  -CAkey $CA_KEY \
  -CAcreateserial \
  -out $2.cert
echo -e "${ORANGE} Moodustan PKCS#12 file (PFX-fail) ${NC}"
# -passout ärajätmisel küsib parooli terminalilt
# Windows-is jääb rippuma
openssl pkcs12 -export \
  -out $2.pfx \
  -inkey $2.key \
  -in $2.cert \
  -certfile $CA_CERT \
  -passout pass:changeit
}

# ------------------------------
# 1. Liigu kausta /opt/keys
#
if [ "$OPSYS" = "Linux" ]; then
  cd /opt
  mkdir keys
  cd keys
fi

# ------------------------------
# 2. Valmista ette CN-d
#
if [ "$OPSYS" = "Linux" ]; then
  CA_CERT_SUBJ="/C=EE/O=RIA/CN=CA-TEST"
  HTTPS_S_CERT_SUBJ="/C=EE/O=RIA/CN=localhost"
  TLS_S_CERT_SUBJ="/C=EE/O=RIA/CN=localhost"
  TLS_K_CERT_SUBJ="/C=EE/O=RIA/CN=localhost"
  TLS_S_SELF_CERT_SUBJ='/C=EE/O=RIA/CN=localhost'
  TLS_K_SELF_CERT_SUBJ='/C=EE/O=RIA/CN=localhost'
else
  # Windows-i eripära, vt:
  # https://stackoverflow.com/questions/31506158/running-openssl-from-a-bash-script-on-windows-subject-does-not-start-with
  # Vähemalt Windows-is väldi tühikuid CN-s
  CA_CERT_SUBJ="//C=EE\O=RIA\CN=CA-TEST"
  HTTPS_S_CERT_SUBJ="//C=EE\O=RIA\CN=localhost"
  TLS_S_CERT_SUBJ="//C=EE\O=RIA\CN=localhost"
  TLS_K_CERT_SUBJ="//C=EE\O=RIA\CN=localhost"
  TLS_S_SELF_CERT_SUBJ='//C=EE\O=RIA\CN=localhost'
  TLS_K_SELF_CERT_SUBJ='//C=EE\O=RIA\CN=localhost'
fi

# ------------------------------
# 3. Genereeri CA-TEST privaatvõti ja sert
#
echo -e "${ORANGE} --- Genereerin CA privaatvõtme ja serdi ${NC}"

# -x509 - Väljastab self-signed serdi, mitte serditaotluse
# -nodes - Privaatvõtit ei krüpteerita
# -subject - Prindib serdile kantava subject-i
openssl req \
  -new \
  -x509 \
  -nodes \
  -days 9999 \
  -subj $CA_CERT_SUBJ \
  -keyout $CA_KEY \
  -out $CA_CERT

# ------------------------------
# 4. Genereeri võtmed ja serdid CA abil
#
genereeriKomplekt "HTTPS Server" "https-server-TEST" $HTTPS_S_CERT_SUBJ
genereeriKomplekt "TLS Server TEST" "tls-server-TEST" $TLS_S_CERT_SUBJ
genereeriKomplekt "TLS Klient TEST" "tls-client-TEST" $TLS_K_CERT_SUBJ

# ------------------------------
# 5. Genereeri TLS serveri privaatvõti ja iseallkirjastatud sert
#
echo -e "${ORANGE} --- Genereerin TLS serveri privaatvõtme ja iseallkirjastatud serdi ${NC}"
openssl req \
  -x509 \
  -days 365 \
  -nodes \
  -sha256 \
  -newkey rsa:2048 \
  -subj $TLS_S_SELF_CERT_SUBJ \
  -keyout 'tls-server-SELF-TEST.key' \
  -out 'tls-server-SELF-TEST.cert'

# ------------------------------
# 6. Genereeri TLS kliendi privaatvõti ja iseallkirjastatud sert
#
echo -e "${ORANGE} --- Genereerin TLS kliendi privaatvõtme ja iseallkirjastatud serdi ${NC}"
openssl req \
  -x509 \
  -days 365 \
  -nodes \
  -sha256 \
  -newkey rsa:2048 \
  -subj $TLS_K_SELF_CERT_SUBJ \
  -keyout 'tls-client-SELF-TEST.key' \
  -out 'tls-client-SELF-TEST.cert'

echo -e "${ORANGE} Veendu, et failid moodustati ${NC}"
ls -l

echo
echo -e "${ORANGE} Pfx-faili saad kontrollida käsuga "
echo -e "openssl pkcs12 -info -in fail.pfx ${NC}"
echo

lopeta