#!/bin/bash

# TARA-Stat-systemd.sh
#
# TARA-Stat veebirakenduse seadistamine systemd-ga käitatavaks
#
# 1) Loon käitluskasutaja (run user)
# 2) Loon systemd haldusüksuse kirjeldusfaili
# 3) Laen deemoni
# 4) (valikuline) Käivitan veebirakenduse (koos logibaasiga)
#
# Vt:
# - https://blog.nodeswat.com/set-up-a-secure-node-js-web-application-9256b8790f11
# - https://nodesource.com/blog/running-your-node-js-app-with-systemd-part-1/
# - https://www.computerhope.com/unix/useradd.htm (useradd)
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

# 0) Kontrollküsimus
echo
echo " --- TARA-Stat veebirakenduse seadistamine systemd-ga käitatavaks"
echo
kasJatkan

# 1) Loon käitluskasutaja (run user)
echo " --- Loon kasutaja tarastat, kui see ei ole juba olemas"
echo
sudo deluser tarastat
sudo useradd -r -s /bin/false --home opt/TARA-Stat tarastat
echo " --- Väljastan kontrolliks teabe kasutaja tarastat kohta"
echo
id tarastat
kasJatkan

# 2) Loon systemd haldusüksuse kirjeldusfaili
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
User=tarastat
Group=tarastat
ExecStart=/usr/bin/node $HOME/Tara-Stat/index.js

[Install]
WantedBy=multi-user.target
EOF

# 3) Laen deemoni
echo " --- Väljastan kontrolliks systemd haldusüksuse kirjeldusfaili"
echo
kasJatkan
cat /lib/systemd/system/tara_stat.service

echo " --- Laen deemoni"
echo
kasJatkan
sudo systemctl daemon-reload

# 4) (valikuline) Käivitan veebirakenduse (koos logibaasiga)
echo " --- Käivitan TARA-Stat veebirakenduse"
echo
kasJatkan
sudo systemctl start tara_stat

lopeta