#!/bin/bash

# Varskenda.sh
#
# TARA-Stat tarkvara uuenduste tõmbamine (ilma repot üle kirjutamata)
# 

# Värvid
ORANGE='\033[0;33m'
NC='\033[0m' # No Color

cd /opt/TARA-Stat
sudo git checkout -- .
sudo git pull origin master

echo
echo -e "${ORANGE} --- TARA-Stat tarkvara värskendatud. ${NC}"
echo -e "Krüptomaterjali (kaustas /opt/keys) ei kirjutatud üle."
echo -e "Ära unusta, et veebirakendus tuleb nüüd uuesti seadistada. ${NC}"
echo