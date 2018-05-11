#!/bin/bash

# TARA-Stat-paigalda.sh
#
# Paigaldab logibaasi (MongoDB) ja
# TARA-Stat veebirakenduse (Node.js rakenduse)
#

echo
echo " --- TARA-Stat paigaldamine"
echo
echo "     paigaldada logibaas (MongoDB)"
echo "     ja TARA-Stat veebirakendus (Node.js rakendus)"
echo
read -p " --- Jätkata  (y/n)? " prompt
if [[ $prompt != y && $prompt != Y ]]
then
  echo OK
  exit
fi

# Kontrollib, kas MongoDB ja Node.js töötavad. Kui töötavad, siis seiskab
MONGO_PID=$(pidof mongod)
if [ ! -z "$MONGO_PID" ]
then
  kill -s 15 $MONGO_PID
  echo " --- Logibaas seisatud"
fi

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
  echo Eemaldan Node.js
  sudo apt-get remove nodejs
  if [ "$?" = 0 ]; then 
    echo " --- Node.js eemaldatud"
  else
    katkesta " --- Node.js eemaldamine ebaõnnestus"
  fi
fi

echo Paigaldan curl-i
sudo apt-get install curl
if [ "$?" = 0 ]; then 
  echo " --- curl paigaldatud"
else
  katkesta " --- curl-i paigaldamine ebaõnnestus"
fi

echo Paigaldan Node.js
curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -
if [ "$?" = 0 ]; then 
  echo " --- Node.js paigaldamise 1. samm OK"
else
  katkesta " --- Node.js paigaldamise 1. samm ebaõnnestus"
fi
sudo apt-get install -y nodejs
if [ "$?" = 0 ]; then 
  echo " --- Node.js paigaldatud"
else
  katkesta " --- Node.js paigaldamine ebaõnnestus"
fi

echo Paigaldan Node.js teeke..
cd $HOME/TARA-Stat

# Eemalda Node.js vanad teegid, kuid neid peaks olema
if [ -d "$node_modules" ]; then
  rm -R node_modules
fi

npm install body-parser --save
if [ "$?" != 0]; then
  katkesta "Node.js teegi body-parser paigaldamine ebaõnnestus"
fi
npm install ejs --save
if [ "$?" != 0]; then
  katkesta "Node.js teegi ejs paigaldamine ebaõnnestus"
fi
npm install express --save
if [ "$?" != 0]; then
  katkesta "Node.js teegi ejs paigaldamine ebaõnnestus"
fi
npm install mongodb --save
if [ "$?" != 0]; then
  katkesta "Node.js teegi mongodb paigaldamine ebaõnnestus"
fi
npm install request --save
if [ "$?" != 0]; then
  katkesta "Node.js teegi request paigaldamine ebaõnnestus"
fi
npm install basic-auth --save
if [ "$?" != 0]; then
  katkesta "Node.js teegi basic-auth paigaldamine ebaõnnestus"
fi
npm install request-debug --save
if [ "$?" != 0]; then
  katkesta "Node.js teegi request-debug paigaldamine ebaõnnestus"
fi
echo " --- Node.js teegid paigaldatud"

function katkesta {
  echo ERROR: $1
  echo "--- Paigaldus katkestatud"
  exit
}
