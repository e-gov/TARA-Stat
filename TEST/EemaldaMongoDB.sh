echo -e "${ORANGE}Eemaldan MongoDB${NC}"
systemctl stop mongod
apt-get -qq purge mongodb-org*
rm -r /var/log/mongodb
rm -r /var/lib/mongodb
