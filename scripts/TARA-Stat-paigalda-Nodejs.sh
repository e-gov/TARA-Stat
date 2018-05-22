#!/bin/bash

# TARA-Stat-paigalda-Rakendus.sh
#
# Paigaldan Node.js
#

echo
echo " --- TARA-Stat: Paigaldan Node.js"
echo

# 0. Kontrollküsimus eksliku käivitamise vastu
# 1. Kontrollin, kas Node.js on juba paigaldatud
# 2. Paigaldan curl-i
# 3. Paigaldan Node.js

# ------------------------------
# Abistaja: Väljasta lõputeade ja välju
#
function lopeta {
  echo
  echo " --- Node.js paigaldamise LÕPP"
  echo
  exit
}

# ------------------------------
# Abistaja: Kontrolli käsu õnnestumist
#
function kontrolli {
  echo
  if [ "$1" = 0 ]
  then
    echo " --- $2 -> OK"
    echo
  else  
    echo " --- $2 -> EBAÕNNESTUS"
    echo
    lopeta
  fi 
}

# ------------------------------
# Abistaja: Küsin kasutajalt kas jätkata
#
function kasJatkan {
  echo " "
  read -p " --- Jätkata (y/n)? " prompt
  if [[ $prompt != y && $prompt != Y ]]
  then
    lopeta
  fi
}

# ------------------------------
# 0. Kontrollküsimus eksliku käivitamise vastu
#
kasJatkan

# ------------------------------
# 1. Kontrollin, kas Node.js on paigaldatud
#
echo
echo Kontrollin, kas Node.js on paigaldatud
# dpkg -s tagastab 0, kui pakett on paigaldatud; 1, kui ei ole
dpkg -s nodejs &> /dev/null
if [ "$?" = 0 ]; then 
  echo " --- Node.js on juba paigaldatud"
  echo "     Eemaldamiseks sisesta: sudo apt-get remove nodejs"
  lopeta  
fi

# ------------------------------
# 2. Paigaldan curl-i
#
echo
echo " --- Paigaldan curl-i"
sudo apt-get install curl
kontrolli "$?" "curl-i paigaldamine"

# ------------------------------
# 3. Paigaldan Node.js
#
echo
echo " --- Paigaldan Node.js"
curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -
kontrolli "$?" "Node.js paigaldamise 1. samm"

sudo apt-get install -y nodejs
kontrolli "$?" "Node.js paigaldamine"

echo " --- Kontrolli Node.js paigaldust:"
echo
nodejs -v
npm --version

echo

lopeta

