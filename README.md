# raspi-config-web-interface

This app is developed to be used on Raspberry Pi for controlling basic settings from the browser like connecting to some WiFi network, setting up static IP address, changing username/password etc.

## How to use 
1. Login to the Pi as root user
2. Clone this repository using this command
```
git clone https://github.com/iZeeshanDhillon/raspi-config-web-interface.git
```
3. Change directory to the project directory with this command
```
cd raspi-config-web-interface
```
4. Run these commands to install dependencies 
```
wget -O - https://raw.githubusercontent.com/meech-ward/NodeJs-Raspberry-Pi/master/Install-Node.sh | sudo bash;
echo "alias node=/opt/nodejs/bin/node" >> ~/.bashrc && source ~/.bashrc
npm install http-server -g
npm install express --save
```
5. Use one of these commands to run the app

```
node app.js
```
OR
```
/opt/nodejs/bin/node app.js
``

Here is the screenshot of the UI
![][image_ref_a32ff4ads]

[image_ref_a32ff4ads]:
data:image/png;base64,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Mb8ERp+RSgAAAAAkE5UAAAAASCYqAQAAAJBMVAIAAAAgmagEAAAAQDJRCQAAAIBkohIAAAAAyUQlAAAAAJKJSgAAAAAkE5UAAAAASCYqAQAAAJBsXCGTb8OYaH/54Thy4Z38HAAAAKNhwdRZ0fnQi/k5GH2iEmOuGJUAAAAYfaIS15KoBAAAAEAyayoBAAAAkExUAgAAACCZqAQAAABAMlEJAAAAgGSiEgAAAADJRCUAAAAAkolKAAAAACQTlQAAAABIJioBAAAAkExUAgAAACCZqAQAAABAMlEJAAAAgGSiEgAAAADJRCUAAAAAkolKAAAAACQTlQAAAABIJioBAAAAkExUAgAAACCZqAQAAABAMlEJAAAAgGSiEgAAAADJRCUAAAAAkolKAAAAACQTlQAAAABIJioBAAAAkExUAgAAACCZqAQAAABAMlEJAAAAgGSiEgAAAADJRCUAAAAAkolKAAAAACQTlQAAAABIJioBAAAAkExUAgAAACCZqAQAAABAMlEJAAAAgGSiEgAAAADJRCUAAAAAkolKAAAAACQTlQAAAABIJioBAAAAkExUAgAAACCZqAQAAABAMlEJAAAAgGSiEgAAAADJRCUAAAAAkolKAAAAACQTlQAAAABIJioBAAAAkExUAgAAACCZqAQAAABAMlEJAAAAgGSiEgAAAADJRCUAAAAAkolKAAAAACQTlQAAAABIJioBAAAAkExUAgAAACCZqAQAAABAMlEJAAAAgGSiEgAAAADJRCUAAAAAkolKAAAAACQTlQAAAABIJioBAAAAkExUAgAAACCZqAQAAABAMlEJAAAAgGSiEgAAAADJRCUAAAAAkolKAAAAACQTlQAAAABIJioBAAAAkExUAgAAACCZqAQAAABAMlEJAAAAgGSiEgAAAADJRCUAAAAAkolKAAAAACQTlQAAAABIJioBAAAAkExUAgAAACCZqAQAAABAMlEJAAAAgGSiEgAAAADJRCUAAAAAkolKAAAAACQTlQAAAABIJioBAAAAkExUAgAAACCZqAQAAABAMlEJAAAAgGSiEgAAAADJRCUAAAAAkolKAAAAACQTlQAAAABIJioBAAAAkExUAgAAACCZqAQAAABAMlEJAAAAgGSiEgAAAADJRCUAAAAAkolKAAAAACQTlQAAAABIJioBAAAAkExUAgAAACCZqAQAAABAMlEJAAAAgGSiEgAAAADJRCUAAAAAkolKAAAAACQTlQAAAABIJioBAAAAkExUAgAAACCZqAQAAABAMlEJAAAAgGSiEgAAAADJRCUAAAAAkolKAAAAACQTlQAAAABIJioBAAAAkExUAgAAACCZqAQAAABAMlEJAAAAgGSiEgAAAADJRCUAAAAAkolKAAAAACQTlQAAAABIJioBAAAAkExUAgAAACCZqAQAAABAMlEJAAAAgGSiEgAAAADJRCUAAAAAkolKAAAAACQTlQAAAABIJioBAAAAkExUAgAAACCZqAQAAABAMlEJAAAAgGSiEgAAAADJRCUAAAAAkolKAAAAACQTlQAAAABIJioBAAAAkExUAgAAACCZqAQAAABAMlEJAAAAgGSiEgAAAADJRCUAAAAAkolKAAAAACQTlQAAAABIJioBAAAAkExUAgAAACCZqAQAAABAMlEJAAAAgGSiEgAAAADJRCUAAAAAkolKAAAAACQTlQAAAABIJioBAAAAkExUAgAAACCZqAQAAABAMlEJAAAAgGSiEgAAAADJRCUAAAAAkolKAAAAACQTlQAAAABIJioBAAAAkExUAgAAACCZqAQAAABAMlEJAAAAgGSiEgAAAADJRCUAAAAAkolKAAAAACQTlQAAAABIJioBAAAAkExUAgAAACCZqAQAAABAMlEJAAAAgGSiEgAAAADJRCUAAAAAkolKAAAAACQTlQAAAABIJioBAAAAkExUAgAAACCZqAQAAABAMlEJAAAAgGSiEgAAAADJRCUAAAAAkolKAAAAACQTlQAAAABIJioBAAAAkExUAgAAACCZqAQAAABAMlEJAAAAgGSiEgAAAADJRCUAAAAAkolKAAAAACQTlQAAAABIJioBAAAAkExUAgAAACCZqAQAAABAMlEJAAAAgGSiEgAAAADJRCUAAAAAkolKAAAAACQTlQAAAABIJioBAAAAkExUAgAAACCZqAQAAABAMlEJAAAAgGSiEgAAAADJRCUAAAAAkolKAAAAACQTlQAAAABIJioBAAAAkExUAgAAACCZqAQAAABAMlEJAAAAgGSiEgAAAADJRCUAAAAAkolKAAAAACQTlQAAAABIJioBAAAAkExUAgAAACCZqAQAAABAMlEJAAAAgGSiEgAAAADJRCUAAAAAkolKAAAAACQTlQAAAABIJioBAAAAkExUAgAAACCZqAQAAABAMlEJAAAAgGSiEgAAAADJRCUAAAAAkolKAAAAACQTlQAAAABIJioBAAAAkExUAgAAACCZqAQAAABAMlEJAAAAgGSiEgAAAADJRCUAAAAAkolKAAAAACQTlQAAAABIJioBAAAAkExUAgAAACCZqAQAAABAMlEJAAAAgGSiEgAAAADJRCUAAAAAkolKAAAAACQTlQAAAABIJioBAAAAkExUAgAAACCZqAQAAABAMlEJAAAAgGSiEgAAAADJRCUAAAAAkolKAAAAACQTlQAAAABIJioBAAAAkExUAgAAACCZqAQAAABAMlEJAAAAgGSiEgAAAADJRCUAAAAAkolKAAAAACQTlQAAAABIJioBAAAAkExUAgAAACCZqAQAAABAMlEJAAAAgGSiEgAAAADJRCUAAAAAkolKAAAAACQTlQAAAABIJioBAAAAkExUAgAAACCZqAQAAABAMlEJAAAAgGSiEgAAAADJRCUAAAAAkolKAAAAACQTlQAAAABIJioBAAAAkExUAgAAACCZqAQAAABAMlEJAAAAgGSiEgAAAADJRCUAAAAAkolKAAAAACQTlQAAAABIJioBAAAAkExUAgAAACCZqAQAAABAMlEJAAAAgGSiEgAAAADJRCUAAAAAkolKAAAAACQTlQAAAABIJioBAAAAkExUAgAAACCZqAQAAABAMlEJAAAAgGSiEgAAAADJRCUAAAAAkolKAAAAACQTlQAAAABIJioBAAAAkExUAgAAACCZqAQAAABAMlEJAAAAgGSiEgAAAADJRCUAAAAAkolKAAAAACQTlQAAAABIJioBAAAAkExUAgAAACCZqAQAAABAMlEJAAAAgGSiEgAAAACJIv5/YnrpChw71sIAAAAASUVORK5CYII=
