#!/bin/bash

echo --- TARA-Stat paigaldamine

read -p "Paigaldada (y/n)? " prompt
if [[ $prompt =~ [yY](es)* ]]
then
  # echo Yes
else
  exit
fi

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

echo -n --- paigaldan Node.js teeke..
cd $home/TARA-Stat
npm install body-parser --save
if [ "$?" != 0]; then
  katkesta "Node.js teegi body-parser paigaldamine ebaõnnestus"
fi
npm install ejs --save
npm install express --save
npm install mongodb --save
npm install request --save
npm install basic-auth --save
npm install request-debug --save
echo OK

function katkesta {
  echo ERROR: $1
  echo "--- Paigaldus katkestatud"
  exit
}
