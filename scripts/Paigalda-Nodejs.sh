#!/bin/bash

# TARA-Stat-paigalda-Nodejs.sh
#
# 0. Kontrollküsimus eksliku käivitamise vastu
# 1. Kontrollin, kas Node.js on juba paigaldatud;
#    kui on, siis teade kasutajale ja töö lõpp  
# 2. Paigaldan curl-i
# 3. Paigaldan Node.js

printf "\n%s\n\n" " --- TARA-Stat: Paigaldan Node.js"

# Väljastan lõputeate ja väljun
function lopeta {
  echo
  echo " --- Node.js paigaldamise LÕPP"
  echo
  exit
}

# Kontrollin käsu õnnestumist
function kontrolli {
  echo
  if [ "$1" = 0 ]
  then
    echo " --- $2 -> OK"
    echo
  else  
    echo " --- $2 -> EBAÕNNESTUS"
    echo
    lopeta
  fi 
}

# Küsin kasutajalt kas jätkata
function kasJatkan {
  echo " "
  read -p " --- Jätkata (y/n)? " prompt
  if [[ $prompt != y && $prompt != Y ]]
  then
    lopeta
  fi
}

# 0. Kontrollküsimus eksliku käivitamise vastu
kasJatkan

printf "\n--- %s\n\n" "1. Kontrollin, kas Node.js on paigaldatud"
# dpkg -s tagastab 0, kui pakett on paigaldatud; 1, kui ei ole
dpkg -s nodejs &> /dev/null
if [ "$?" = 0 ]; then 
  echo " --- Node.js on juba paigaldatud"
  echo "     Eemaldamiseks sisesta: sudo apt-get remove nodejs"
  lopeta  
fi

printf "\n--- %s\n\n" "2. Paigaldan curl-i"
sudo apt-get install curl
kontrolli "$?" "curl-i paigaldamine"

printf "\n--- %s\n\n" "3. Paigaldan Node.js"
curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -
kontrolli "$?" "Node.js paigaldamise 1. samm"

sudo apt-get install -y nodejs
kontrolli "$?" "Node.js paigaldamine"

printf "\n%s\n\n" "Kontrolli Node.js paigaldust:"
nodejs -v
npm --version

lopeta

