#!/bin/bash

# TARA-Stat-systemd.sh
#
# TARA-Stat veebirakenduse seadistamine systemd-ga käitatavaks
#
# vt https://nodesource.com/blog/running-your-node-js-app-with-systemd-part-1/
#

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

echo
echo " --- TARA-Stat veebirakenduse seadistamine systemd-ga käitatavaks"
echo
kasJatkan

echo " --- Loon kasutaja tara-stat, kui see ei ole juba olemas"
echo
sudo addgroup tara-stat
sudo adduser --no-create-home tara-stat tara-stat

echo " --- Loon systemd haldusüksuse kirjeldusfaili"
echo
sudo dd of=/lib/systemd/system/tara_stat.service << EOF
[Unit]
Description=TARA-Stat veebirakendus (Node.js-l)
Documentation=https://e-gov.github.io/TARA-Stat/
After=network.target

[Service]
# Environment=PORT=5000
# (kui sooviks vaikimisi porti 5000 muuta)
User=tara-stat
Group=tara-stat
ExecStart=/usr/bin/node $HOME/Tara-Stat/index.js

[Install]
WantedBy=multi-user.target
EOF

echo " --- Väljastan kontrolliks systemd haldusüksuse kirjeldusfaili"
echo
cat /lib/systemd/system/tara_stat.service
