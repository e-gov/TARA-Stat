#!/bin/bash

# TARA-Stat-paigalda-kood.sh
#
# Paigaldan TARA-Stat koodi
#
# 1. Laen veebirakenduse GitHub-i repost kausta /opt/TARA-Stat

# ------------------------------
# Abistaja: Väljasta lõputeade ja välju
#
function lopeta {
  echo
  echo " --- TARA-Stat koodi paigaldamise LÕPP"
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

# 0. Kontrollküsimus
echo
echo " --- Paigaldan TARA-Stat koodi"
echo
kasJatkan

# 1. Laen veebirakenduse GitHub-i repost kausta /opt/TARA-Stat
cd /opt
# Kustutan senise
sudo rm -R TARA-Stat
sudo git clone https://github.com/e-gov/TARA-Stat

