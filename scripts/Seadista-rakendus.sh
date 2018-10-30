#!/bin/bash

# TARA-Stat-seadista-rakendus.sh
#
# Seadistan TARA-Stat veebirakenduse (systemd-ga käitatavaks)
#
# 1. Loon Node.js käitluskasutaja (run user)
# 2. Paigaldan rakendusele vajalikud Node.js teegid
# 3. Annan tarastat-le õigused kodukaustale (TARA-Stat)
# 4. Loon systemd haldusüksuse kirjeldusfaili
# 5. Laen deemoni
# 6. (valikuline) Käivitan veebirakenduse (koos logibaasiga)
#
# Vt:
# - https://blog.nodeswat.com/set-up-a-secure-node-js-web-application-9256b8790f11
# - https://nodesource.com/blog/running-your-node-js-app-with-systemd-part-1/
# - https://www.computerhope.com/unix/useradd.htm (useradd)
# - https://stackoverflow.com/questions/26944841/what-is-the-lowest-privileged-user-that-node-js-can-run-as-on-ubuntu?utm_medium=organic&utm_source=google_rich_qa&utm_campaign=google_rich_qa (minimaalsed õigused Node.js käitamiseks)
#

# Värvid
ORANGE='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# ------------------------------
# Abistaja: Väljasta lõputeade ja välju
#
function lopeta {
  echo -e "${ORANGE} --- Node.js paigaldamise LÕPP ${NC}"
  exit
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
  echo
}

# ------------------------------
# Abistaja: Kontrolli käsu õnnestumist
#
function kontrolli {
  echo
  if [ "$1" = 0 ]
  then
    echo -e "${ORANGE} --- $2 -> OK ${NC}"
  else  
    echo -e "${ORANGE} --- $2 -> EBAÕNNESTUS ${NC}"
    lopeta
  fi 
}

# ------------------------------
# Abistaja: Paigalda Node.js teek
#
function paigalda_Nodejs_teek {
  npm install $1 --save --silent
  kontrolli "$?" "Node.js teegi $1 paigaldamine"
}

# ------------------------------
# 0. Kontrollküsimus
echo -e "${ORANGE} --- TARA-Stat veebirakenduse seadistamine ${NC}"
kasJatkan

# ------------------------------
# Seiska TARA-Stat veebirakendus
echo -e "${ORANGE} --- Seiskan TARA-Stat veebirakenduse ${NC}"
sudo systemctl stop tarastat

# ------------------------------
# 1. Loon käitluskasutaja (run user)
echo -e "${ORANGE} --- Loon kasutaja tarastat, kui see ei ole juba olemas ${NC}"
sudo deluser tarastat
# Loon süsteemse kasutaja (-r) tarastat, kellel pole õigust sisse logida (-s) ja
# kelle kodukaust on /opt/TARA-Stat. Kodukausta veel ei loo
sudo useradd -r -s /bin/false --home /opt/TARA-Stat tarastat
echo -e "${ORANGE} --- Väljastan kontrolliks teabe kasutaja tarastat kohta ${NC}"
id tarastat

# ------------------------------
# 2. Paigaldan rakendusele vajalikud Node.js teegid
#
echo -e "${ORANGE} --- Paigaldan Node.js teegid ${NC}"
cd /opt/TARA-Stat

# Vali teegirepo
echo -e "${ORANGE} --- Vali teegirepo ${NC}"
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
paigalda_Nodejs_teek "rwlock"
paigalda_Nodejs_teek "mongodb"

echo -e "${ORANGE} --- Node.js teegid paigaldatud ${NC}"

# ------------------------------
# 3. Annan tarastat-le õigused kodukaustale (TARA-Stat)
#
sudo chown -R tarastat:tarastat /opt/TARA-Stat
cd /opt/TARA-Stat

# ------------------------------
# 4. Loon systemd haldusüksuse kirjeldusfaili
#
echo -e "${ORANGE} --- Loon systemd haldusüksuse kirjeldusfaili ${NC}"
sudo dd of=/lib/systemd/system/tarastat.service << EOF
[Unit]
Description= --- TARA-Stat veebirakendus (Node.js-l) ---
Documentation=https://e-gov.github.io/TARA-Stat/
After=network.target

[Service]
# Environment=PORT=5000
# (kui sooviks vaikimisi porti 5000 muuta)
User=tarastat
Group=tarastat
ExecStart=/usr/bin/node /opt/TARA-Stat/index.js

[Install]
WantedBy=multi-user.target
EOF

# echo -e "${ORANGE} --- Väljastan kontrolliks systemd haldusüksuse kirjeldusfaili ${NC}"
# kasJatkan
# echo " --------------------------------------------"
# cat /lib/systemd/system/tarastat.service
# echo " --------------------------------------------"
# echo

# ------------------------------
# 5. Laen deemoni
#
echo -e "${ORANGE} --- Laen deemoni ${NC}"
sudo systemctl daemon-reload

# ------------------------------
# 6. (valikuline) Käivitan veebirakenduse (koos logibaasiga)
#
echo -e "${ORANGE} --- Käivitan TARA-Stat veebirakenduse ${NC}"
kasJatkan
sudo systemctl start tarastat
echo -e "${ORANGE} --- Kontrolli TARA-Stat veebirakenduse käivitumist ${NC}"
sudo systemctl status tarastat

lopeta