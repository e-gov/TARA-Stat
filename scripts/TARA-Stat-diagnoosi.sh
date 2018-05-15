#!/bin/bash

# TARA-Stat-diagnoosi.sh
#
# Selgita välja paigalduse olukord
#

echo
echo " --- TARA-Stat: Selgita välja paigaldise olukord"
echo
echo "1) kuva MongoDB konf-ifail (/etc/mongodb.conf)"
echo "2) kuva MongoDB andmebaasilogi (/var/log/mongodb/mongod.log)"
echo "3) kuva andmebaasifailide kaust (/var/lib/mongodb)"
echo "4) kuva systemd haldusüksuse kirjeldusfail (/lib/systemd/system/mongod.service)"
echo "5) kuva automaatkäivitusskript (/etc/init.d/mongodb)"
echo "0) lõpeta"
echo
read -p "Vali toiming: " REPLY
echo

case "$REPLY" in

  1 )
    echo " --- kuvan MongoDB konf-ifaili"
    echo
    cat /etc/mongodb.conf
  ;;
  2 )
    echo " --- kuvan MongoDB andmebaasilogi"
    echo
    tail /var/log/mongodb/mongod.log
  ;;
  3 )
    echo " --- kuvan andmebaasifailide kausta"
    echo
    ls -a -l /var/lib/mongodb
  ;;
  4 )
    echo " --- kuvan systemd haldusüksuse kirjeldusfaili"
    echo
    less /lib/systemd/system/mongod.service
  ;;
  5 )
    echo " --- kuvan automaatkäivitusskripti"
    echo
    cat /etc/init.d/mongodb
  ;;
  0 ) echo " --- LÕPP"
  ;;
  *) echo "Invalid option. Try another one."; continue;;

esac

