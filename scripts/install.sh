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

# echo Paigaldan Node.JS
# sudo apt-get install nodejs

echo Paigalduse kontroll
nodejs -v
echo $?