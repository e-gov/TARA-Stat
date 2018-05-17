#!/bin/bash

# Seadistan TARA-Stat minimaalse testi - mini.js -
# systemd-ga käitatavaks
#
# 1. Loon Node.js käitluskasutaja mini
# 2. Annan mini-le õigused kodukaustale (mini)
# 3. Kopeerin faili mini.js kausta mini
# 4. Loon systemd haldusüksuse kirjeldusfaili mini.service
# 5. Laen deemoni
# 6. Käivitan teenuse mini
#
echo " --- Seadistan TARA-Stat minimaalse testi - mini.js -"
echo "     systemd-ga käitatavaks"

# 1. Loon käitluskasutaja (run user) mini
sudo deluser mini
# Loon süsteemse kasutaja (-r) mini,
# kelle kodukaust on /opt/mini. Kodukausta veel ei loo
sudo useradd -r --home /opt/mini mini
id mini

# 2. Annan mini-le õigused kodukaustale (mini)
#
sudo mkdir /opt/mini 
sudo chown -R mini:mini /opt/mini
cd /opt/mini

# 3. Kopeerin kausta mini faili mini.js
cp /opt/TARA-Stat/mini.js /opt/mini

# 4. Loon systemd haldusüksuse kirjeldusfaili
#
echo " --- Loon systemd haldusüksuse kirjeldusfaili"
echo
sudo dd of=/lib/systemd/system/mini.service << EOF
[Unit]
Description= --- TARA-Stat minimaalne test ---
Documentation=https://e-gov.github.io/TARA-Stat/
After=network.target

[Service]
User=mini
Group=mini
ExecStart=/usr/bin/node /opt/mini/mini.js

[Install]
WantedBy=multi-user.target
EOF

# 5. Laen deemoni
sudo systemctl daemon-reload

# 6. Käivitan veebirakenduse (koos logibaasiga)
sudo systemctl start mini
sudo systemctl status mini
