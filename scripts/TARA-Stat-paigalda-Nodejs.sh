#!/bin/bash

# TARA-Stat-paigalda-Rakendus.sh
#
# Paigaldan Node.js ja seadistan TARA-Stat veebirakenduse
#

echo
echo " --- TARA-Stat: Paigaldan Node.js ja TARA-Stat veebirakendus"
echo
kasJatkan

# 1. Paigalda Node.js

# 1. Paigaldan Node.js
# 2. Paigaldan curl-i
# 3. Paigaldan Node.js
# 4. Paigaldan rakendusele vajalikud Node.js teegid
# 5. Genereerin ja paigaldan veebirakenduse HTTPS võtmed
# 6. Loon kasutaja tarastat
# 7. Loon usalduse TARA-Serveri ja TARA-Stat-i vahel
# 8. Paigaldan Node.js protsessihalduri pm2

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
# Abistaja: Paigalda Node.js teek
#
function paigalda_Nodejs_teek {
  npm install $1 --save
  kontrolli "$?" "Node.js teegi paigaldamine"
}

# ------------------------------
# Kontrollin, kas Node.js töötab. Kui töötab, siis seiskan
# NODEJS_PID=$(pidof nodejs)
# if [ ! -z "$NODEJS_PID" ]
# then
#   kill -s 15 $NODEJS_PID
#   echo " --- TARA-Stat veebirakendus seisatud"
# fi

# ------------------------------
# 1. Kontrollin, kas Node.js on paigaldatud
#
echo Kontrollin, kas Node.js on paigaldatud
# dpkg -s tagastab 0, kui pakett on paigaldatud; 1, kui ei ole
dpkg -s nodejs &> /dev/null
if [ "$?" = 0 ]; then 
  echo " --- Eemaldan Node.js"
  sudo apt-get remove nodejs
  kontrolli "$?" " --- Node.js eemaldamine"
fi

# ------------------------------
# 2. Paigaldan curl-i
#
echo " --- Paigaldan curl-i"
sudo apt-get install curl
kontrolli "$?" " --- curl-i paigaldamine"

# ------------------------------
# 3. Paigaldan Node.js
#
echo Paigaldan Node.js
curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -
kontrolli "$?" " --- Node.js paigaldamise 1. samm"

sudo apt-get install -y nodejs
kontrolli "$?" " --- Node.js paigaldamine"

echo " --- Kontrolli Node.js paigaldust:"
nodejs -v
npm --version

echo
kasJatkan

# ------------------------------
# 4. Paigaldan rakendusele vajalikud Node.js teegid
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
echo
kasJatkan

# ------------------------------
# 5. Genereerin ja paigaldan veebirakenduse HTTPS võtmed
#
cd $HOME/TARA-Stat
mkdir keys
cd keys

# Genereeri võtmed
openssl genrsa -out tara-stat.key 2048
openssl req -new -x509 -key tara-stat.key -out tara-stat.cert -days 3650 -subj /CN=tara-stat

echo Veendu, et failid tara-stat.cert ja tara-stat.key moodustati
echo
ls -l

echo
kasJatkan

echo Veendu, et TARA-Stat konf-ifailis failidele tara-stat.cert ja tara-stat.key õigesti viidatud
echo
grep -i 'tara-stat' $HOME/TARA-Stat/config.js

echo
kasJatkan

# ------------------------------
# 6. Loon kasutaja tarastat
#
echo " --- Loon kasutaja tarastat"
sudo adduser tarastat
kontrolli "$?" " --- Kasutaja tarastat loomine"
kasJatkan

# TODO õiguste andmine

# ------------------------------
# 7. Loon usalduse TARA-Serveri ja TARA-Stat-i vahel
#
read -p "Anna API-kasutajanimi" APIUSER
read -p "Anna API-võti (juhusõne pikkusega vähemalt 20 tähemärki)" APIKEY

echo " --- Paigaldan API kasutajanime ja võtme TARA-Stat konf-i"

sed -i "s/APIUSER-changeit/$APIUSER" $HOME/TARA-Stat/config.js
sed -i "s/APIKEY-changeit/$APIKEY" $HOME/TARA-Stat/config.js

echo "Veendu, et $APIUSER ja $APIKEY said paigaldatud:"
echo
grep -i 'config.tarastat' $HOME/TARA-Stat/config.js
echo

kasJatkan

# ------------------------------
# 8. Paigaldan Node.js protsessihalduri pm2
#
echo "Paigaldan Node.js protsessihalduri pm2"
sudo npm install -g pm2
kontrolli "$?" "Protsessihalduri pm2 paigaldamine"

echo "Genereerin pm2 automaatkäivituse skripti"
pm2 startup systemd

echo "Täida eelmise käsu väljundi viimane rida (sellega luuakse systemd unit, millega pm2 automaatkäivitatakse)"

echo "Seejärel pm2 start index käivitab TARA-Stat veebirakenduse"

lopeta

