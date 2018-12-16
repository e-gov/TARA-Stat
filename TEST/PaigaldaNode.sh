printf "\n--- %s\n\n" "1. Kontrollin, kas Node.js on paigaldatud"
# dpkg -s tagastab 0, kui pakett on paigaldatud; 1, kui ei ole
dpkg -s nodejs &> /dev/null
if [ "$?" = 0 ]; then 
  echo " --- Node.js on juba paigaldatud"
  echo "     Eemaldamiseks sisesta: sudo apt-get remove nodejs"
  lopeta  
fi

printf "\n--- %s\n\n" "2. Paigaldan curl-i"
sudo apt-get install curl
kontrolli "$?" "curl-i paigaldamine"

printf "\n--- %s\n\n" "3. Paigaldan Node.js"
curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -
kontrolli "$?" "Node.js paigaldamise 1. samm"

sudo apt-get install -y nodejs
kontrolli "$?" "Node.js paigaldamine"

printf "\n%s\n\n" "Kontrolli Node.js paigaldust:"
nodejs -v
npm --version