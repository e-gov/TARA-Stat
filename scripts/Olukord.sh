#!/bin/bash

# TARA-Stat-diagnoosi.sh
#
# Annan teavet paigalduse olukorra kohta
#

# Värvid
ORANGE='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo
echo -e "${ORANGE} TARA-Stat: Annan teavet paigalduse olukorra kohta ${NC}"
echo -e "${ORANGE} TARA-Stat: Veebirakenduse (Node.js) staatus: ${NC}"
systemctl status tarastat
echo -e "${ORANGE} TARA-Stat: Logibaasi (MongoDB) staatus: ${NC}"
# ps aux | grep tarasta
systemctl status mongodb
# ps aux | grep mongodb
echo -e "${ORANGE} TARA-Stat: Diagnostikaks olulisi:"
echo "                    MongoDB                           "
echo "| konf-ifail  | /etc/mongodb.conf                    |"
echo "| logi        | /var/log/mongodb/mongod.log          |"
echo "| baasifailid | var/lib/mongodb                      |"
echo "| haldusüksus | /lib/systemd/system/mongod.service   |"
echo " ---------------------------------------------------- "
echo "                  TARA-Stat                           "
echo "| konf-ifail  | /opt/TARA-Stat/config.js             |"
echo "| logi        | /opt/TARA-Stat/log.txt               |"
echo "| haldusüksus | /lib/systemd/system/tarastat.service |"
echo -e " ----------------------------------------------------  ${NC}"
echo 