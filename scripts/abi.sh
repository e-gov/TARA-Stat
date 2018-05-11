#!/bin/bash

echo --- TARA-Stat käivitamine

read -p "Käivitada logibaas (MongoDB) ja veebirakendus (Node.js rakendus) (y/n)? " prompt
if [[ $prompt =~ [yY](es)* ]]
then
  echo OK
else
  exit
fi
