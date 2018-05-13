#!/bin/bash

# TARA-Stat-paigalda-MongoDB.sh
#
# Paigalda logibaasi (MongoDB), sh loo vajalikud andmebaasikasutajad
#

echo
echo " --- TARA-Stat: Paigalda logibaas (MongoDB)"
echo

# 1. Kaitse eksliku käivitamise vastu
# 2. Kontrolli, kas MongoDB töötab. Kui töötab, siis seiska
# 3. Kontrolli, kas MongoDB on juba paigaldatud.
#    Vajadusel eemalda. Küsi, kas ka andmefailid
# 4. Paigalda MongoDB
# 5. Sea kasutajale mongodb parool (algselt tal pole parooli)
# 6. Käivita MongoDB
# 7. Loo MongoDB kasutaja userAdmin
# 8. Peata MongoDB
# 9. Lülita autentimine sisse
# 10. Käivita andmebaas uuesti
# 11. Loo kasutajad rakendus ja andmehaldur
# 12. Väljasta lõputeade

# 1. Kaitse eksliku käivitamise vastu
kasJatkan

# 2. Kontrolli, kas MongoDB töötab. Kui töötab, siis seiska
sudo systemctl is-active --quiet  mongod
if [ "$?" = 0 ]; then
  sudo systemctl stop mongod
  echo " --- Logibaas seisatud"
fi

# 3. Kontrolli, kas MongoDB on juba paigaldatud.
# Vajadusel eemalda. Küsi, kas ka andmefailid
# dpkg -s tagastab 0, kui pakett on paigaldatud; 1, kui ei ole
dpkg -s mongodb &> /dev/null
if [ "$?" = 0 ]; then 
  echo " --- MongoDB on juba paigaldatud"
  read -p " --- Kas paigaldada MongoDB uuesti (y/n)? " prompt
  if [[ $prompt != y && $prompt != Y ]]
  then
    lopeta
  else
    echo " --- Eemaldan MongoDB"
    sudo apt-get remove mongodb
    kontrolli $? " OK" " --- MongoDB eemaldamine ebaõnnestus"
  fi
  read -p " --- Kas eemaldada ka andmefailid (y/n)? " prompt
  if [[ $prompt = y || $prompt = Y ]]
  then
    sudo rm -R /var/lib/mongodb
    kontrolli $? " OK" " --- Andmefailide (/var/lib/mongodb) eemaldamine ebaõnnestus"
  fi
fi

# 4. Paigalda MongoDB
echo " --- Paigaldan MongoDB"
echo " --- Paigaldamise 1. samm: paigaldan paketikontrolli võtmed"
sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 2930ADAE8CAF5059EE73BB4B58712A2291FA4AD5
kontrolli $? " OK" " --- Paigaldamise 1. samm ebaõnnestus"

echo " --- Paigaldamise 2. samm"
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu xenial/mongodb-org/3.6 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-3.6.list
kontrolli $? " OK" " --- Paigaldamise 2. samm ebaõnnestus"

echo " --- Paigaldamise 3. samm"
sudo apt-get install -y mongodb-org-server=3.6.4 mongodb-org-shell=3.6.4
kontrolli $? " OK" " --- Paigaldamise 3. samm ebaõnnestus"

# Kontrolli MongoDB paigaldust
echo " --- Paigalduse kontroll: "
mongod --version

# 5. Sea kasutajale mongodb parool (algselt tal pole parooli)
echo " --- Sean kasutajale mongodb parooli"
sudo passwd mongodb

# Sea mongodb logifaili ja andmebaasifailide omanikuks
# (Vajalik juhul, kui oled omanikku mingil põhjusel vahetanud)
# sudo chown mongodb /var/log/mongodb/mongod.log
# cd /var/lib/mongodb
# sudo chown -R mongodb:mongodb *

# 6. Käivita MongoDB
# kasutaja mongodb alt, teenusena (deemonina)
# Alternatiiv: käivitada taustaprotsessina
# su -c 'mongod --config /etc/mongod.conf &' - mongodb
echo " --- Käivitan MongoDB"
sudo systemctl start mongod
kontrolli $? " OK" " --- MongoDB käivitamine ebaõnnestus" 

# 7. Loo MongoDB kasutaja userAdmin
# Vt https://docs.mongodb.com/manual/tutorial/write-scripts-for-the-mongo-shell/ 
echo " --- Loon MongoDB kasutaja userAdmin"
echo "     Parool: changeit. Vaheta hiljem parool ära"
mongo admin --eval 'db.createUser({user: "userAdmin",pwd: "changeit", roles: [ { role: userAdminAnyDatabase", db: "admin" } ] } )'

# 8. Peata MongoDB
echo " --- Peatan MongoDB"
sudo systemctl stop mongod
kontrolli $? " OK" " --- MongoDB peatamine ebaõnnestus" 

# 9. Lülita autentimine sisse
# Failis /etc/mongod.conf muuda authorization: disabled -> enabled
echo " --- Lülitan sisse autentimise"
sed -i 's/authorization: disabled/authorization: enabled/' /etc/mongod.conf
kontrolli $? " OK" " --- MongoDB konf-ifaili muutmine ebaõnnestus" 

# 10. Käivita andmebaas uuesti
echo " --- Käivitan MongoDB uuesti"
sudo systemctl start mongod
kontrolli $? " OK" " --- MongoDB käivitamine ebaõnnestus" 

# 11. Loo kasutajad rakendus ja andmehaldur
# ühendudes andmebaasi külge kasutajana userAdmin
echo " --- Loon MongoDB kasutajad rakendus ja andmehaldur"
echo "     Paroolid: changeit. Vaheta hiljem paroolid"
mongo -u "userAdmin" -p "changeit" --authenticationDatabase "admin" <<EOF
use users
db.createUser(
  {
    user: "rakendus",
    pwd: "changeit",
    roles: [ { role: "readWrite", db: "logibaas" } ]
  }
)
db.createUser(
  {
    user: "andmehaldur",
    pwd: "changeit",
    roles: [ { role: "readWrite", db: "logibaas" } ]
  }
)
EOF

# 12. Väljasta lõputeade

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
  read -p " --- Jätkata (y/n)? " prompt
  if [[ $prompt != y && $prompt != Y ]]
  then
    lopeta
  fi

}