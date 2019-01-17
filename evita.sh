#!/bin/bash

sudo cp index.js /opt/tara-stat/tara-stat
sudo cp public/js/alusta.js /opt/tara-stat/tara-stat/public/js
sudo cp views/pages/index.ejs /opt/tara-stat/tara-stat/views/pages

sudo systemctl restart tarastat
sudo systemctl status tarastat
