#!/bin/bash

# TARA-Stat-paigalda-Rakendus.sh
#
# Paigaldan Node.js ja seadistan TARA-Stat veebirakenduse
#

echo
echo " --- TARA-Stat: Paigaldan Node.js ja TARA-Stat veebirakendus"
echo

# 1. Kaitse eksliku käivitamise vastu
# 2. Paigaldan Node.js
# 3. Paigaldan curl-i
# 4. Paigaldan Node.js
# 5. Paigaldan rakendusele vajalikud Node.js teegid
# 6. Genereerin ja paigaldan veebirakenduse HTTPS võtmed
# 7. Loon kasutaja tarastat
# 8. Paigaldan MongoDB kasutamise salasõna
# 9. Loon usalduse TARA-Serveri ja TARA-Stat-i vahel
# Praegu välja lülitatud:
# 10. Paigaldan Node.js protsessihalduri pm2

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
# 1. Kaitse eksliku käivitamise vastu
kasJatkan

# ------------------------------
# Kontrollin, kas Node.js töötab. Kui töötab, siis seiskan
# NODEJS_PID=$(pidof nodejs)
# if [ ! -z "$NODEJS_PID" ]
# then
#   kill -s 15 $NODEJS_PID
#   echo " --- TARA-Stat veebirakendus seisatud"
# fi

# ------------------------------
# 2. Kontrollin, kas Node.js on paigaldatud
#
echo
echo Kontrollin, kas Node.js on paigaldatud
# dpkg -s tagastab 0, kui pakett on paigaldatud; 1, kui ei ole
dpkg -s nodejs &> /dev/null
if [ "$?" = 0 ]; then 
  echo " --- Eemaldan Node.js"
  sudo apt-get remove nodejs
  kontrolli "$?" "Node.js eemaldamine"
fi

# ------------------------------
# 3. Paigaldan curl-i
#
echo
echo " --- Paigaldan curl-i"
sudo apt-get install curl
kontrolli "$?" "curl-i paigaldamine"

# ------------------------------
# 4. Paigaldan Node.js
#
echo
echo " --- Paigaldan Node.js"
curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -
kontrolli "$?" "Node.js paigaldamise 1. samm"

sudo apt-get install -y nodejs
kontrolli "$?" "Node.js paigaldamine"

echo " --- Kontrolli Node.js paigaldust:"
nodejs -v
npm --version

echo
kasJatkan

# ------------------------------
# 5. Paigaldan rakendusele vajalikud Node.js teegid
#
echo
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
# 6. Genereerin ja paigaldan veebirakenduse HTTPS võtmed
#
echo
echo " --- Genereerin ja paigaldan veebirakenduse HTTPS võtmed"
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

# ------------------------------
# 7. Loon kasutaja tarastat
#
echo " --- Loon kasutaja tarastat"
sudo adduser tarastat
kontrolli "$?" " --- Kasutaja tarastat loomine"
kasJatkan

# TODO õiguste andmine

# ------------------------------
# 8. Paigaldan MongoDB kasutamise salasõna
#
echo
echo " --- Paigaldan MongoDB kasutamise salasõna TARA-Stat konf-i"
read -p "Anna MongoDB kasutaja 'rakendus' salasõna: " MONGOUSERPWD
sed -i "s/MONGOUSERPWD-changeit/$MONGOUSERPWD/" $HOME/TARA-Stat/config.js

# ------------------------------
# 9. Loon usalduse TARA-Serveri ja TARA-Stat-i vahel
#
echo
echo " --- Paigaldan API võtme TARA-Stat konf-i"
read -p "Anna API võti (juhusõne pikkusega vähemalt 20 tähemärki): " APIKEY

sed -i "s/APIKEY-changeit/$APIKEY" $HOME/TARA-Stat/config.js

echo "Veendu, et $MONGOUSERPWD ja $APIKEY said paigaldatud: "
echo
grep -i 'config.' $HOME/TARA-Stat/config.js
echo

kasJatkan

# ------------------------------
# 10. Paigaldan Node.js protsessihalduri pm2
#
# Praegu välja lülitatud

lopeta

echo
echo "Paigaldan Node.js protsessihalduri pm2"
sudo npm install -g pm2
kontrolli "$?" "Protsessihalduri pm2 paigaldamine"

echo
echo "Genereerin pm2 automaatkäivituse skripti"
pm2 startup systemd

echo
echo "Täida eelmise käsu väljundi viimane rida (sellega luuakse systemd unit, millega pm2 automaatkäivitatakse)"

echo "Seejärel pm2 start index käivitab TARA-Stat veebirakenduse"

lopeta

