#!/bin/bash

# TARA-Stat-seiska.sh seiskab logibaasi (MongoDB) ja
# TARA-Stat veebirakenduse (Node.js rakenduse)
#

echo
echo --- TARA-Stat seiskamine
echo
echo "  seisata logibaas (MongoDB)"
echo "  ja TARA-Stat veebirakendus (Node.js rakendus)"
echo
read -p "Jätkata  (y/n)? " prompt
if [[ $prompt != y && $prompt != Y ]]
then
  echo OK
  exit
fi

MONGO_PID=$(pidof mongod)
if [ -z "$MONGO_PID" ]
then
  echo Logibaas pole töös
else
  kill -s 15 $MONGO_PID
  echo "Logibaas seisatud"
fi

NODEJS_PID=$(pidof nodejs)
if [ -z "$NODEJS_PID" ]
then
  echo TARA-Stat veebirakendus pole töös
else
  kill -s 15 $NODEJS_PID
  echo "TARA-Stat veebirakendus seisatud"
fi

echo --- Lõpp
echo