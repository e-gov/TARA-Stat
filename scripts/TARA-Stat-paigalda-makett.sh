#!/bin/bash

# TARA-Stat-paigalda-makett.sh
#
# Paigaldan TARA-Stat makettrakenduse
#
#

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
# Abistaja: Paigalda Node.js teek
#
function paigalda_Nodejs_teek {
  npm install $1 --save
  kontrolli "$?" "Node.js teegi paigaldamine"
}

# ------------------------------
# 0. Kontrollküsimus
echo
echo " --- TARA-Stat makettrakenduse paigaldamine"
echo
echo "Eelnevalt pead olema käsitsi eemaldanud vana koodi"
echo "ja klooninud uuesti repo:"
echo "sudo rm -R /opt/TARA-Stat"
echo "sudo git clone https://github.com/e-gov/TARA-Stat"
echo
kasJatkan

# ------------------------------
# 1. Sean konf-ifailis TARA-Stat serveri domeeninime
echo
echo " --- Sean konf-ifailis TARA-Stat serveri domeeninime"
cd /opt/TARA-Stat
read -p "Sisesta TARA-Stat serveri domeeninimi: " TARASTAT
sudo sed -i "s/localhost/$TARASTAT/" /opt/TARA-Stat/mockup-config.js 

echo
echo " --- Kontrolli, et domeeninimi on õigesti seatud:"
cat mockup-config.js

# ------------------------------
# 2. Paigaldan rakendusele vajalikud Node.js teegid
#
echo
echo " --- Paigaldan Node.js teegid"
cd /opt/TARA-Stat

# Vali teegirepo
echo
echo " --- Vali teegirepo"
read -p "Kas soovid teegid paigaldada sisemisest teegihoidlast? (y/n)? " prompt
  if [[ $prompt = y || $prompt = Y ]] 
  then
    read -p "Sisesta sisemise teegihoidla URL " teegihoidla
    sudo npm config set registry $teegihoidla
  else
    sudo npm config set registry https://registry.npmjs.org/  
  fi
  echo

# Eemaldan Node.js vanad teegid, kuid neid peaks olema
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
echo
kasJatkan

# ------------------------------
# 3. Loon usalduse makettrakenduse ja TARA-Stat-i vahel
#
echo
echo " --- Paigaldan TARA-Stat API võtme makettrakenduse konf-i"

read -p "Anna API võti: " TARASTATSECRET
sed -i "s/TARASTATSECRET-changeit/$TARASTATSECRET/" /opt/TARA-Stat/mockup-config.js

echo "Veendu, et $TARASTATSECRET sai paigaldatud: "
echo
grep -i 'config.' /opt/TARA-Stat/mockup-config.js
echo

echo " --- Makettrakendus paigaldatud"
echo
echo "Makettrakenduse saad käivitada: nodejs mockup"
echo
