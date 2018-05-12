#!/bin/bash

# TARA-Stat-kaivita.sh
#
# Käivitab logibaasi (MongoDB) ja
# TARA-Stat veebirakenduse (Node.js rakendus)
#

echo
echo --- TARA-Stat käivitamine
echo
echo "  käivitada logibaas (MongoDB)"
echo "  ja TARA-Stat veebirakendus (Node.js rakendus)"
echo
read -p "Jätkata  (y/n)? " prompt
if [[ $prompt != y && $prompt != Y ]]
then
  echo OK
  exit
fi

if pgrep -x "mongod" > /dev/null
then
  echo MongoDB juba käib
else
  echo Käivitan MongoDB
  # Käivita MongoDB konf-ifaili äranäitamisega ja kasutaja `mongodb` alt:
  su -c 'mongod --config /etc/mongod.conf &' - mongodb

  if [ "$?" = 0 ]; then 
    echo "MongoDB käivitatud"
    MONGO_PID=$(pidof mongod)
    ps -n $MONGO_PID
  else
    echo "MongoDB käivitamine ebaõnnestus"
    exit
  fi
fi

if pgrep -x "nodejs" > /dev/null
then
  echo Node.js juba käib
else
  echo "Käivitan Node.js"
  cd $HOME/TARA-Stat
  nodejs index &
  if [ "$?" = 0 ]; then 
    echo "Node.js käivitatud"
    NODEJS_PID=$(pidof mongod)
    ps -n $NODEJS_PID
  else
    echo "Node.js käivitamine ebaõnnestus"
    exit
  fi
fi

echo --- Lõpp
echo