#!/bin/bash

# TARA-Stat-diagnoosi.sh
#
# Annan teavet paigalduse olukorra kohta
#

echo
echo " --- TARA-Stat: Annan teavet paigalduse olukorra kohta"
echo

systemctl status tarasta
ps aux | grep tarasta
systemctl status mongodb
ps aux | grep mongodb

echo "            MongoDB                                     "
echo "| konf-ifail  | `/etc/mongodb.conf`                    |"
echo "| logi        | `/var/log/mongodb/mongod.log`          |"
echo "| baasifailid | `var/lib/mongodb`                      |"
echo "| haldusüksus | `/lib/systemd/system/mongod.service`   |"

echo "            TARA-Stat                                   "
echo "| konf-ifail  | `/opt/TARA-Stat/config.js`             |"
echo "| logi        | `/opt/TARA-Stat/log.txt`               |"
echo "| baasifailid | `var/lib/mongodb`                      |"
echo "| haldusüksus | `/lib/systemd/system/tarastat.service` |"
