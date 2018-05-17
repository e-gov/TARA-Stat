#!/bin/bash

# TARA-Stat-paigalda-rakendus.sh
#
# Paigaldan TARA-Stat veebirakenduse (systemd-ga käitatavaks)
#
# 1. Loon Node.js käitluskasutaja (run user)
# 2. Laen veebirakenduse GitHub-i repost kausta /opt/TARA-Stat
# 3. Paigaldan rakendusele vajalikud Node.js teegid
# 4. Genereerin ja paigaldan veebirakenduse HTTPS võtmed
# 5. Paigaldan MongoDB kasutamise salasõna
# 6. Loon usalduse TARA-Serveri ja TARA-Stat-i vahel
# 7. Annan tarastat-le õigused kodukaustale (TARA-Stat)
# 8. Loon systemd haldusüksuse kirjeldusfaili
# 9. Laen deemoni
# 10. (valikuline) Käivitan veebirakenduse (koos logibaasiga)
#
# Vt:
# - https://blog.nodeswat.com/set-up-a-secure-node-js-web-application-9256b8790f11
# - https://nodesource.com/blog/running-your-node-js-app-with-systemd-part-1/
# - https://www.computerhope.com/unix/useradd.htm (useradd)
# - https://stackoverflow.com/questions/26944841/what-is-the-lowest-privileged-user-that-node-js-can-run-as-on-ubuntu?utm_medium=organic&utm_source=google_rich_qa&utm_campaign=google_rich_qa (minimaalsed õigused Node.js käitamiseks)
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

# ------------------------------
# Abistaja: Paigalda Node.js teek
#
function paigalda_Nodejs_teek {
  npm install $1 --save
  kontrolli "$?" "Node.js teegi paigaldamine"
}

# 0. Kontrollküsimus
echo
echo " --- TARA-Stat veebirakenduse seadistamine systemd-ga käitatavaks"
echo
kasJatkan

# 1. Loon käitluskasutaja (run user)
echo " --- Loon kasutaja tarastat, kui see ei ole juba olemas"
echo
sudo deluser tarastat
# Loon süsteemse kasutaja (-r) tarastat, kellel pole õigust sisse logida (-s) ja
# kelle kodukaust on /opt/TARA-Stat. Kodukausta veel ei loo
sudo useradd -r -s /bin/false --home /opt/TARA-Stat tarastat
echo " --- Väljastan kontrolliks teabe kasutaja tarastat kohta"
echo
id tarastat
kasJatkan

# 2. Laen veebirakenduse GitHub-i repost kausta /opt/TARA-Stat
cd /opt
sudo git clone https://github.com/e-gov/TARA-Stat

# ------------------------------
# 3. Paigaldan rakendusele vajalikud Node.js teegid
#
echo
echo " --- Paigaldan Node.js teegid"
cd $HOME/TARA-Stat

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
# 4. Genereerin ja paigaldan veebirakenduse HTTPS võtmed
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
# 5. Paigaldan MongoDB kasutamise salasõna
#
echo
echo " --- Paigaldan MongoDB kasutamise salasõna TARA-Stat konf-i"
read -p "Anna MongoDB kasutaja 'rakendus' salasõna: " MONGOUSERPWD
sed -i "s/MONGOUSERPWD-changeit/$MONGOUSERPWD/" $HOME/TARA-Stat/config.js

# ------------------------------
# 6. Loon usalduse TARA-Serveri ja TARA-Stat-i vahel
#
echo
echo " --- Paigaldan API võtme TARA-Stat konf-i"

read -p "Anna API võti: (juhusõne pikkusega vähemalt 20 tähemärki): " TARASTATSECRET
sed -i "s/TARASTATSECRET-changeit/$TARASTATSECRET/" $HOME/TARA-Stat/config.js

echo "Veendu, et $MONGOUSERPWD ja $APIKEY said paigaldatud: "
echo
grep -i 'config.' $HOME/TARA-Stat/config.js
echo

kasJatkan

# ------------------------------
# 7. Annan tarastat-le õigused kodukaustale (TARA-Stat)
#
sudo chown -R tarastat:tarastat /opt/TARA-Stat
cd TARA-Stat

# ------------------------------
# 8. Loon systemd haldusüksuse kirjeldusfaili
#
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

# ------------------------------
# 9. Laen deemoni
#
echo " --- Väljastan kontrolliks systemd haldusüksuse kirjeldusfaili"
echo
kasJatkan
cat /lib/systemd/system/tara_stat.service

echo " --- Laen deemoni"
echo
kasJatkan
sudo systemctl daemon-reload

# ------------------------------
# 10. (valikuline) Käivitan veebirakenduse (koos logibaasiga)
#
echo " --- Käivitan TARA-Stat veebirakenduse"
echo
kasJatkan
sudo systemctl start tara_stat

lopeta