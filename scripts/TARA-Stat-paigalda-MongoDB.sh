#!/bin/bash

# TARA-Stat-paigalda-MongoDB.sh
#
# Paigalda logibaas (MongoDB), sh loo vajalikud andmebaasikasutajad
#

echo
echo " --- TARA-Stat: Paigalda logibaas (MongoDB)"
echo

# 1. Kaitse eksliku käivitamise vastu
# 2. Kontrolli, kas MongoDB töötab. Kui töötab, siis seiska
# 3. Paigalda MongoDB
# 4. Sea kasutajale mongodb parool (algselt tal pole parooli)
# 5. Käivita MongoDB
# 6. Loo MongoDB kasutaja userAdmin
# 7. Peata MongoDB
# 8. Lülita autentimine sisse
# 9. Käivita andmebaas uuesti
# 10. Loo kasutajad rakendus ja andmehaldur
# 11. Väljasta lõputeade

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
# 1. Kaitse eksliku käivitamise vastu
kasJatkan

# ------------------------------
# 2. Kontrolli, kas MongoDB töötab. Kui töötab, siis seiska
sudo systemctl is-active --quiet  mongod
if [ "$?" = 0 ]; then
  sudo systemctl stop mongod
  echo " --- Logibaas seisatud"
  echo
fi

# ------------------------------
# 3. Paigalda MongoDB
echo
echo " --- Paigaldan MongoDB"
echo
echo " --- Paigaldamise 1. samm: paigaldan paketikontrolli võtmed"
echo
sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 2930ADAE8CAF5059EE73BB4B58712A2291FA4AD5
kontrolli $? " --- Paigaldamise 1. samm"

echo
echo " --- Paigaldamise 2. samm"
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu xenial/mongodb-org/3.6 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-3.6.list
kontrolli $? " --- Paigaldamise 2. samm"

# Uuenda paketinimekirja:
sudo apt-get update

echo
echo " --- Paigaldamise 3. samm"
sudo apt-get install -y mongodb-org-server=3.6.4 mongodb-org-shell=3.6.4
# sudo apt-get install -y mongodb-org
kontrolli $? " --- Paigaldamise 3. samm"

# Kontrolli MongoDB paigaldust
echo
echo " --- Paigalduse kontroll: "
mongod --version

# ------------------------------
# 4. Sea kasutajale mongodb parool (algselt tal pole parooli)
echo " --- Sean kasutajale mongodb parooli"
sudo passwd mongodb

# Sea mongodb logifaili ja andmebaasifailide omanikuks
# (Vajalik juhul, kui oled omanikku mingil põhjusel vahetanud)
# sudo chown mongodb /var/log/mongodb/mongod.log
# cd /var/lib/mongodb
# sudo chown -R mongodb:mongodb *

# ------------------------------
# 5. Käivita MongoDB
# kasutaja mongodb alt, teenusena (deemonina)
# Alternatiiv: käivitada taustaprotsessina
# su -c 'mongod --config /etc/mongod.conf &' - mongodb
echo
echo " --- Käivitan MongoDB"
sudo systemctl start mongod
kontrolli $? " --- MongoDB käivitamine" 

# ------------------------------
# 6. Loo MongoDB kasutaja userAdmin
# Vt https://docs.mongodb.com/manual/tutorial/write-scripts-for-the-mongo-shell/
echo
echo " --- Loon MongoDB kasutaja userAdmin"
read -p " --- Sisesta parool userAdmin-le: " PWD_USERADMIN
mongo <<EOF
use admin
db.createUser(
  { user: "userAdmin",
    pwd: "$PWD_USERADMIN",
    roles: [
      {
        role: "userAdminAnyDatabase",
        db: "admin"
      }
    ]
  }
)
EOF

# ------------------------------
# 7. Peata MongoDB
echo
echo " --- Peatan MongoDB"
sudo systemctl stop mongod
kontrolli $? " --- MongoDB peatamine"

# ------------------------------
# 8. Lülita autentimine sisse
# Failis /etc/mongod.conf muuda authorization: disabled -> enabled
echo
echo " --- Lülitan sisse autentimise"
sed -i 's/authorization: disabled/authorization: enabled/' /etc/mongod.conf
kontrolli $? " --- MongoDB konf-ifaili muutmine" 

# ------------------------------
# 9. Käivita andmebaas uuesti
echo
echo " --- Käivitan MongoDB uuesti"
sudo systemctl start mongod
kontrolli $? " --- MongoDB käivitamine" 

# ------------------------------
# 10. Loo kasutajad rakendus ja andmehaldur
# ühendudes andmebaasi külge kasutajana userAdmin
echo
echo " --- Loon MongoDB kasutajad rakendus ja andmehaldur"
read -p " --- Sisesta parool rakendusele: " PWD_RAKENDUS
read -p " --- Sisesta parool andmehaldurile: " PWD_ANDMEHALDUR
mongo -u "userAdmin" -p "$PWD_USERADMIN" --authenticationDatabase "admin" <<EOF
use users
db.createUser(
  {
    user: "rakendus",
    pwd: "$PWD_RAKENDUS",
    roles: [ { role: "readWrite", db: "logibaas" } ]
  }
)
db.createUser(
  {
    user: "andmehaldur",
    pwd: "$PWD_ANDMEHALDUR",
    roles: [ { role: "readWrite", db: "logibaas" } ]
  }
)
EOF

# Muutujate kasutamise kohta heredoc-is vt:
# https://unix.stackexchange.com/questions/405250/passing-and-setting-variables-in-a-heredoc 

# 11. Väljasta lõputeade

lopeta

