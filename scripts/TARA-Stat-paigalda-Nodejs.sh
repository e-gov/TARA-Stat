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
# NB! Praegu mitte tehtud -> 7. Loon kasutaja tarastat
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

