# raspi-config-web-interface

This app is developed to be used on Raspberry Pi for controlling basic settings from the browser like connecting to some WiFi network, setting up static IP address, changing username/password etc.

## How to use
1. Login to the Pi as root user
2. Clone the repository and change directory to it
```
git clone https://github.com/iZeeshanDhillon/raspi-config-web-interface.git
cd raspi-config-web-interface
```
3. Make the network.sh script executeable and make directory
```
sudo chmod +x ./network.sh
mkdir -p /storage/0/Videos
```
4. Run these commands to install dependencies
```
wget -O - https://raw.githubusercontent.com/meech-ward/NodeJs-Raspberry-Pi/master/Install-Node.sh | sudo bash;
echo "alias node=/opt/nodejs/bin/node" >> ~/.bashrc && source ~/.bashrc
sudo npm install http-server -g
sudo npm install express --save
```
5. Use one of these commands to run the app

```
sudo node app.js
```
OR
```
sudo /opt/nodejs/bin/node app.js
```

## How does it look like

#### Home Page
![alt home](assets/img.png "Home")

#### Set static or DHCP IP
![alt static](assets/static.png "static")

#### Change some user's username and Password 
![alt username](assets/username.png "username")

#### Toggle WiFi or connect to some network
![alt wifi](assets/wifi.png "wifi") 
