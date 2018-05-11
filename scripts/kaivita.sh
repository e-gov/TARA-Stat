#!/bin/bash

echo --- TARA-Stat käivitamine
echo
echo "käivitada logibaas (MongoDB)"
echo "ja veebirakendus (Node.js rakendus)"
echo
read -p "Jätkata  (y/n)? " prompt
if [[ $prompt =~ [yY](es)* ]]
then
  echo OK
else
  exit
fi

if pgrep -x "mongod" > /dev/null
then
  echo MongoDB juba käib
else
  echo Käivitan MongoDB
  mongod --config /etc/mongod.conf &
  if [ "$?" = 0 ]; then 
    echo "MongoDB käivitatud"
    MONGO_PID=$(pidof mongod)
    ps -n $MONGO_PID
    exit
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
  cd $home/TARA-Stat
  nodejs index &
  if [ "$?" = 0 ]; then 
    echo "Node.js käivitatud"
    NODEJS_PID=$(pidof mongod)
    ps -n $NODEJS_PID
    exit
  else
    echo "Node.js käivitamine ebaõnnestus"
    exit
  fi
fi

