#!/bin/bash

#
# Genereeri TARA-Stat jaoks vajalik krüptomaterjal.
#
# Krüptomaterjal luuakse jooksva kausta alamkausta keys.
#
# Krüptomaterjali võib luua ka muu vahendiga; sellisel juhul
# tuleb vajalike nimedega ja omadustega võtmete ja sertide
# olemasolu kaustas /opt/tara-ci-config/keys enne TARA-Stat 
# käivitamist.
#
# 
# 1) CA privaatvõti ja iseallkirjastatud sert
# 1) HTTPS serveri privaatvõti ja CA poolt allkirjastatud sert
# 2) TLS serveri privaatvõti ja CA poolt allkirjastatud sert
# 3) TLS kliendi privaatvõti ja CA poolt allkirjastatud sert
# 4) TLS serveri privaatvõti ja iseallkirjastatud sert
# 5) TLS kliendi privaatvõti ja iseallkirjastatud sert
#
# Töötab nii Linux-is kui ka Windows-is.
# Op-süsteem näidatakse skripti käivitamisel.
# Windows-i puhul arvestada, et OpenSSL töötab seal mittetäielikult:
# salasõnade küsimisel jääb rippuma. Seetõttu salasõnad on skripti
# sisse kirjutatud.
#
# Käivitamine:
# - Linux: 
#    käivita suvalisest kaustast
#    $ ./opt/tara-ci-config/TARA-Stat/Gen-krypto.sh <SD> <KD>
# - Windows:
#    mine kausta tara-ci-config/TARA-Stat
#    $ ./Gen-krypto.sh <SD> <KD>
#
# kus:
#   <SD> - TLS serveri domeeninimi
#   <KD> - TLS kliendi domeeninimi
# Kui server ja klient on samas masinas, siis vali mõlema
# domeeninimeks localhost.

# Värvid
ORANGE='\033[0;33m'
NC='\033[0m' # No Color

CA_CERT='ca.cert'
CA_KEY='ca.key'

# ------------------------------
# Abistaja: Väljasta lõputeade ja välju
function lopeta {
  echo -e "${ORANGE} --- Krüpto genereerimise LÕPP ${NC}"
  exit
}

# ------------------------------
# Haara skripti parameetrid
if (( $# != 2 )); then
  echo -e "${ORANGE} Kasuta nii: Gen-krypto-TEST-sh <serveri domeen> <kliendi domeen> ${NC}"
  lopeta
fi
SD=$1
KD=$2
echo -e "${ORANGE} Serveridomeen: $SD ${NC}"
echo -e "${ORANGE} Kliendidomeen: $KD ${NC}"

# ------------------------------
# Abistaja: Küsin kasutajalt, kas jätkata
function kasJatkan {
  read -p " --- Jätkata (y/n)? " prompt
  if [[ $prompt != y && $prompt != Y ]]
  then
    lopeta
  fi
  echo
}

# ------------------------------
# 0. Op-süsteemi valimine
echo
echo -e "${ORANGE} --- Genereerin TARA-Stat testimiseks vajaliku krüptomaterjali"
echo -e "1) CA privaatvõtme ja serdi"
echo -e "2) HTTPS serveri privaatvõtme, serdi ja pfx-faili "
echo -e "3) TLS serveri privaatvõtme, serdi ja pfx-faili"
echo -e "4) TLS kliendi privaatvõtme, serdi ja pfx-faili"
echo -e "Krüptomaterjal moodustatakse kausta:"
echo -e "tara-ci-config/TARA-Stat/keys ${NC}"
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
# 1. Moodusta võtmete kaust ja liigu sinna
#
mkdir keys
cd keys

# ------------------------------
# 2. Valmista ette CN-d
#
if [ "$OPSYS" = "Linux" ]; then
  CA_CERT_SUBJ="/C=EE/O=TARA-Stat TEST/CN=CA-TEST"
  HTTPS_S_CERT_SUBJ="/C=EE/O=RIA/CN=$SD"
  TLS_S_CERT_SUBJ="/C=EE/O=RIA/CN=$SD"
  TLS_K_CERT_SUBJ="/C=EE/O=RIA/CN=$KD"
  TLS_S_SELF_CERT_SUBJ="/C=EE/O=RIA/CN=$SD"
  TLS_K_SELF_CERT_SUBJ="/C=EE/O=RIA/CN=$KD"
else
  # Windows-i eripära, vt:
  # https://stackoverflow.com/questions/31506158/running-openssl-from-a-bash-script-on-windows-subject-does-not-start-with
  # Vähemalt Windows-is väldi tühikuid CN-s
  CA_CERT_SUBJ="//C=EE\O=TARA-Stat TEST\CN=CA-TEST"
  HTTPS_S_CERT_SUBJ="//C=EE\O=RIA\CN=$SD"
  TLS_S_CERT_SUBJ="//C=EE\O=RIA\CN=$SD"
  TLS_K_CERT_SUBJ="//C=EE\O=RIA\CN=$KD"
  TLS_S_SELF_CERT_SUBJ="//C=EE\O=RIA\CN=$SD"
  TLS_K_SELF_CERT_SUBJ="//C=EE\O=RIA\CN=$KD"
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
genereeriKomplekt "HTTPS Server" "https-server" $HTTPS_S_CERT_SUBJ
genereeriKomplekt "TLS Server" "tls-server" $TLS_S_CERT_SUBJ
genereeriKomplekt "TLS Klient" "tls-client" $TLS_K_CERT_SUBJ

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
  -keyout 'tls-server-SELF.key' \
  -out 'tls-server-SELF.cert'

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
  -keyout 'tls-client-SELF.key' \
  -out 'tls-client-SELF.cert'

echo -e "${ORANGE} Veendu, et failid moodustati ${NC}"
ls -l

echo
echo -e "${ORANGE} Pfx-faili saad kontrollida käsuga "
echo -e "openssl pkcs12 -info -in fail.pfx ${NC}"
echo

lopeta