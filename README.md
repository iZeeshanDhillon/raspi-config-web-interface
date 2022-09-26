# raspi-config-web-interface

This app is developed to be used on Raspberry Pi for controlling basic settings from the browser like connecting to some WiFi network, setting up static IP address, changing username/password etc.

### How to use 
Run these commands to install dependencies 
```
wget -O - https://raw.githubusercontent.com/meech-ward/NodeJs-Raspberry-Pi/master/Install-Node.sh | sudo bash;
echo "alias node=/opt/nodejs/bin/node" >> ~/.bashrc && source ~/.bashrc
npm install http-server -g
npm install express --save
```
Make sure to switch to root user and use one of these commands to run the app

```
node app.js
```
OR
```
/opt/nodejs/bin/node app.js
```
