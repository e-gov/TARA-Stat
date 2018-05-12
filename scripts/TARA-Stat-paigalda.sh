#!/bin/bash

# TARA-Stat-paigalda.sh
#
# Paigaldab:
# - Node.js
# - logibaasi (MongoDB) ja
# - TARA-Stat veebirakenduse (Node.js rakenduse)
#

echo
echo " --- TARA-Stat paigaldamine"
echo

# ------------------------------
# Paigalda Node.js
#
function paigalda_Nodejs {

  # Kontrollib, kas Node.js töötab. Kui töötab, siis seiskab
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
    if [ "$?" = 0 ]; then 
      echo " --- Node.js eemaldatud"
    else
      katkesta " --- Node.js eemaldamine ebaõnnestus"
    fi
  fi

  echo " --- Paigaldan curl-i"
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

  echo " --- Kontrolli Node.js paigaldust:"
  nodejs -v
  npm --version

  echo " --- Paigaldan Node.js teegid"
  cd $HOME/TARA-Stat
  
}

# ------------------------------
# Paigalda veebirakendus
#
function paigalda_veebirakendus {

}

# ------------------------------
# Paigalda rakendusele vajalikud Node.js teegid
#
function paigalda_Nodejs_teegid {

  # Eemalda Node.js vanad teegid, kuid neid peaks olema
  if [ -d "$node_modules" ]; then
    rm -R node_modules
  fi

  npm install body-parser --save
  if [ "$?" != 0 ]; then
    katkesta "Node.js teegi body-parser paigaldamine ebaõnnestus"
  fi
  npm install ejs --save
  if [ "$?" != 0 ]; then
    katkesta "Node.js teegi ejs paigaldamine ebaõnnestus"
  fi
  npm install express --save
  if [ "$?" != 0 ]; then
    katkesta "Node.js teegi ejs paigaldamine ebaõnnestus"
  fi
  npm install mongodb --save
  if [ "$?" != 0 ]; then
    katkesta "Node.js teegi mongodb paigaldamine ebaõnnestus"
  fi
  npm install request --save
  if [ "$?" != 0 ]; then
    katkesta "Node.js teegi request paigaldamine ebaõnnestus"
  fi
  npm install basic-auth --save
  if [ "$?" != 0 ]; then
    katkesta "Node.js teegi basic-auth paigaldamine ebaõnnestus"
  fi
  npm install request-debug --save
  if [ "$?" != 0 ]; then
    katkesta "Node.js teegi request-debug paigaldamine ebaõnnestus"
  fi
  echo " --- Node.js teegid paigaldatud"

}

# ------------------------------
# Katkestamine
#
function katkesta {
  echo ERROR: $1
  echo "--- Paigaldus katkestatud"
  exit
}

# ------------------------------
# Kontrolli käsu õnnestumist
#
function kontrolli {
  if [ "$1" = 0 ]
  then
    echo "$2 OK"
  else  
    echo "$2 ebaõnnestus"
    exit
  fi 
}

PS3='Vali toiming: '
options=("paigalda Node.js" "paigalda MongoDB" "paigalda TARA-Stat veebirakendus" "Lõpeta")
select opt in "${options[@]}"
do
  case $opt in
    "paigalda Node.js")
      paigalda_Nodejs
      ;;
    "paigalda MongoDB")
      ;;
    "paigalda TARA-Stat veebirakendus")
      paigalda_veebirakendus
      ;;
    "Lõpeta")
      exit
      ;;
    *) echo invalid option;;
  esac
done
