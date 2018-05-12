#!/bin/bash

# TARA-Stat-paigalda-MongoDB.sh
#
# Paigaldab logibaasi (MongoDB)
#

echo
echo " --- TARA-Stat: Logibaasi (MongoDB) paigaldamine"
echo

read -p " --- Paigaldada MongoDB (y/n)? " prompt
if [[ $prompt != y && $prompt != Y ]]
then
  exit
fi

# Kontrollib, kas MongoDB töötab. Kui töötab, siis seiskab
MONGO_PID=$(pidof mongod)
if [ ! -z "$MONGO_PID" ]
then
  kill -s 15 $MONGO_PID
  echo " --- Logibaas seisatud"
fi

# Kontrolli, kas MongoDB on juba paigaldatud. Vajadusel eemalda
# dpkg -s tagastab 0, kui pakett on paigaldatud; 1, kui ei ole
dpkg -s mongodb &> /dev/null
if [ "$?" = 0 ]; then 
  echo " --- MongoDB on juba paigaldatud"
  read -p " --- Kas paigaldada MongoDB uuesti (y/n)? " prompt
  if [[ $prompt != y && $prompt != Y ]]
  then
    exit
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

echo " --- Paigaldan MongoDB"
echo " --- Paigaldamise 1. samm: paigaldan paketikontrolli võtmed"
sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 2930ADAE8CAF5059EE73BB4B58712A2291FA4AD5
kontrolli $? " OK" " --- Paigaldamise 1. samm ebaõnnestus"

echo " --- Paigaldamise 2. samm"
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu xenial/mongodb-org/3.6 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-3.6.list
kontrolli $? " OK" " --- Paigaldamise 2. samm ebaõnnestus"

echo " --- Paigaldamise 2. samm"
sudo apt-get install -y mongodb-org-server=3.6.4 mongodb-org-shell=3.6.4
kontrolli $? " OK" " --- Paigaldamise 3. samm ebaõnnestus"

echo " --- Paigalduse kontroll: "
mongod --version

echo " --- Sean kasutajale mongodb parooli"
sudo passwd mongodb

# Käivita MongoDB kasutaja mongodb alt
# su -c 'mongod --config /etc/mongod.conf &' - mongodb

su -c 'systemctl start mongod' - mongodb
kontrolli $? " OK" " --- MongoDB käivitamine ebaõnnestus" 

# Vt https://docs.mongodb.com/manual/tutorial/write-scripts-for-the-mongo-shell/ 

#Kasutajakontode loomine
echo " --- Loon MongoDB kasutaja userAdmin"
mongo admin --eval 'db.createUser({user: "userAdmin",pwd: "changeit", roles: [ { role: userAdminAnyDatabase", db: "admin" } ] } )'

echo " --- Peatan MongoDB"
su -c 'systemctl stop mongod' - mongodb
kontrolli $? " OK" " --- MongoDB peatamine ebaõnnestus" 

echo " --- Lülitan sisse autentimise"



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
