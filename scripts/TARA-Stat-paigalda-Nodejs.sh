#!/bin/bash

# TARA-Stat-paigalda-Rakendus.sh
#
# Paigaldan Node.js ja TARA-Stat veebirakenduse
#

echo
echo " --- TARA-Stat: Paigaldan Node.js ja TARA-Stat veebirakendus"
echo
kasJatkan

# 1. Paigalda Node.js

# ------------------------------
# 1. Paigalda Node.js
# 2. Paigaldan rakendusele vajalikud Node.js teegid

# Kontrollin, kas Node.js töötab. Kui töötab, siis seiskab
NODEJS_PID=$(pidof nodejs)
if [ ! -z "$NODEJS_PID" ]
then
  kill -s 15 $NODEJS_PID
  echo " --- TARA-Stat veebirakendus seisatud"
fi

echo Kontrollin, kas Node.js on paigaldatud
# dpkg -s tagastab 0, kui pakett on paigaldatud; 1, kui ei ole
dpkg -s nodejs &> /dev/null
if [ "$?" = 0 ]; then 
  echo " --- Eemaldan Node.js"
  sudo apt-get remove nodejs
  kontrolli "$?" " --- Node.js eemaldamine ebaõnnestus"
fi

echo " --- Paigaldan curl-i"
sudo apt-get install curl
kontrolli "$?" " --- curl-i paigaldamine ebaõnnestus"

echo Paigaldan Node.js
curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -
kontrolli "$?" " --- Node.js paigaldamise 1. samm ebaõnnestus"

sudo apt-get install -y nodejs
kontrolli "$?" " --- Node.js paigaldamine ebaõnnestus"

echo " --- Kontrolli Node.js paigaldust:"
nodejs -v
npm --version

# ------------------------------
# 2. Paigaldan rakendusele vajalikud Node.js teegid
#
echo " --- Paigaldan Node.js teegid"
cd $HOME/TARA-Stat

# Eemalda Node.js vanad teegid, kuid neid peaks olema
if [ -d "$node_modules" ]; then
  rm -R node_modules
fi

paigalda_Nodejs_teek "body-parser"
paigalda_Nodejs_teek "ejs"
paigalda_Nodejs_teek "express"
paigalda_Nodejs_teek "mongodb"
paigalda_Nodejs_teek "request"
paigalda_Nodejs_teek "basic-auth"
paigalda_Nodejs_teek "request-debug"
echo " --- Node.js teegid paigaldatud"

# ------------------------------
# Abistaja: Paigalda Node.js teek
#
function paigalda_Nodejs_teek {
  npm install $1 --save
  kontrolli "$?" "Node.js teegi paigaldamine ebaõnnestus"
}

# ------------------------------
# Abistaja: Väljasta lõputeade ja välju
#
function lopeta {
  echo
  echo " --- MongoDB paigaldamise LÕPP"
  echo
  exit
}

# ------------------------------
# Abistaja: Kontrolli käsu õnnestumist
#
function kontrolli {
  if [ "$1" = 0 ]
  then
    echo "$2 OK"
  else  
    echo "$2 ebaõnnestus"
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