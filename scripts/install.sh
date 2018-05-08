#!/bin/bash

echo --- TARA-Stat paigaldamine

read -p "Paigaldada (y/n)? " answer
case ${answer:0:1} in
    y|Y )
        # echo Yes
    ;;
    * )
        exit
    ;;
esac

# echo Kontrollin, kas Node.js on paigaldatud
# dpkg -s tagastab 0, kui pakett on paigaldatud; 1, kui ei ole
dpkg -s nodejs &> /dev/null
if [ "$?" = 0 ]; then 
  echo Eemaldan Node.js
  sudo apt-get remove nodejs
  if [ "$?" = 0 ]; then 
    echo "Node.js eemaldatud"
  else
    echo "Node.js eemaldamine ebaõnnestus"
    exit
  fi
else
  echo Paigaldan Node.js
  sudo apt-get install nodejs
  if [ "$?" = 0 ]; then 
    echo "Node.js paigaldatud"
    exit
  else
    echo "Node.js paigaldamine ebaõnnestus"
    exit
  fi
fi
