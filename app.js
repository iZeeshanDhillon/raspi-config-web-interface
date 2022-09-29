const express = require('express')
const app = express()
const port = 8080

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
// in latest body-parser use like below.
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    //send file index.html
    res.sendFile(__dirname + '/index.html')
})

//create route for form submission
app.post('/static_ip', (req, res) => { 
    
    //get request parameters
    var ip = req.body.ip;
    var subnet = req.body.mask;
    var gateway = req.body.gateway;
    var dns = req.body.dns;
    var dns2 = req.body.dns2;


    //split subnet mask into octets
    var octets = subnet.split('.')
    //count 1's in binary representation of each octet
    var mask = 0
    for (var i = 0; i < octets.length; i++) {
        mask += ((octets[i] >>> 0).toString(2).match(/1/g) || []).length
    }

    lines = "interface wlan0\nstatic ip_address=" + ip + "/" + mask + "\nstatic routers=" + gateway + "\nstatic domain_name_servers=" + dns + " " + dns2
    fs = require('fs')
    //Append data to file /etc/dhcpcd.conf
    fs.appendFile('/etc/dhcpcd.conf', lines, function (err) {
        if (err) {
            res.status(200).send('Error occured while writing to file. Try restarting the device.')
        }
    });
    //Restart wifi interface
    var exec = require('child_process').exec;
    exec('sudo ifconfig wlan0 down && sudo ifconfig wlan0 up && sudo ip link set wlan0 up', function (error, stdout, stderr) {
        if (error) {
            res.status(200).send('Could not restart wifi interface. Try rebooting the device.')
        }
    });
    //send "done" in response with https status code 200
    res.status(200).send('Static IP set successfully. Please wait a few seconds for changes to take effect.')

})

app.post('/use_dhcp', (req, res) => {
    cmd = "sed -i '/interface wlan0/d' /etc/dhcpcd.conf && sed -i '/static /d' /etc/dhcpcd.conf && ifconfig wlan0 down && ifconfig wlan0 up && sudo ip link set wlan0 up"
    var exec = require('child_process').exec;
    exec(cmd, function (error, stdout, stderr) {
        if (error) {
            res.status(200).send('Could not use DHCP. Please check if it exists. Or run the app as root user.')
        }
        res.status(200).send('Using DHCP. Please wait a few seconds for changes to take effect.')
    });
})

app.get('/wifi_status', (req, res) => {
    console.log('wifi status requested')
    var exec = require('child_process').exec;
    exec("ifconfig | grep 'wlan0' | awk '{print $1}'", function (error, stdout, stderr) {
        if ((stdout+stderr).includes('wlan0')) {
            console.log('wifi is up' + stdout + stderr)
            res.status(200).send('ON')
        } else {
            console.log('wifi is down' + stdout + stderr)
            res.status(200).send('OFF')
        }
    });
})

app.post('/wifi_toggle', (req, res) => {
    var fs = require('fs')
    var exec = require('child_process').exec;
    target_state = req.body.state
    if (target_state == 'ON') {
        exec('sudo ifconfig wlan0 up', function (error, stdout, stderr) {
            if (error) {
                res.status(200).send("Couldn't turn on wifi. Please make sure the app is tunning as root user or reboot the device if the problem persists.")
            }
        });
        var flag = 0
        while (true){
            console.log('waiting for wifi to turn on' + flag)
            exec("ifconfig | grep 'wlan0' | awk '{print $1}'", function (error, stdout, stderr) {
                console.log('stdout: ' + stdout)
                console.log('stderr: ' + stderr)
                if ((stdout+stderr).includes('wlan0')){
                    flag = 1
                }
            });
            if (flag == 1){
                res.status(200).send('ON')
                break
            }

        }
    }
    else if (target_state == 'OFF') {
        exec('sudo ifconfig wlan0 down', function (error, stdout, stderr) {
            if (error) {
                res.status(200).send("Couldn't turn off wifi. Please make sure the app is tunning as root user or reboot the device if the problem persists.")
            }
        });
        var flag = 0
        while (true){
            console.log('waiting for wifi to turn off:' + flag)
            exec("ifconfig | grep 'wlan0' | awk '{print $1}'", function (error, stdout, stderr) {
                console.log('stdout: ' + stdout)
                console.log('stderr: ' + stderr)
                if ((stdout+stderr).includes('wlan0') == false){
                    flag = 1
                }
            });
            if (flag == 1){
                res.status(200).send('OFF')
                break
            }
        }
    }
})

app.get('/wifi_scan', (req, res) => {
    //res.status(200).send('Dhillon Family:Dhillon Family:StormFiber:Tenda_A2DFC0')
    //return
    //remove file scan.txt if it exists
    var fs = require('fs')
    fs.exists('scan.txt', function (exists) {
        if (exists) {
            fs.unlink('scan.txt', function (err) {});
        }
    });
    var exec = require('child_process').exec;
    exec('sudo iwlist wlan0 scan|grep SSID > scan.txt', function (error, stdout, stderr) {
        if (error) {
            res.status(200).send('WiFi interface is busy. Please refresh in few a seconds.')
        }
        else {
            fs = require('fs')
            fs.readFile('scan.txt', 'utf8', function (err, data) {
                if (err) {
                    res.status(200).send('WiFi interface is busy. Please refresh in few a seconds.')
                }
                else {
                        var lines = data.split('\n')
                        var networks = []
                        for (var i = 0; i < lines.length; i++) {
                            var ssid = lines[i].split(':')[1]
                            if (ssid != undefined) {
                                ssid = ssid.replace('"', '')
                                ssid = ssid.replace('"', '')
                                networks.push(ssid)
                            }
                        }
                        networks_string = ""
                        for (var i = 0; i < networks.length; i++) {
                            networks_string += networks[i] + ":"
                        }
                        networks_string = networks_string.slice(0, -1)
                        res.status(200).send(networks_string)
                }
            });
        }
    });
})

app.post('/wifi_connect', (req, res) => {
    ssid = req.body.ssid
    password = req.body.password
    console.log("connecting to " + ssid + " with password " + password)
    var fs = require('fs')
    var exec = require('child_process').exec;
    //connect to wifi using wpa_supplicant
    cmd = 'sudo wpa_passphrase "' + ssid + '" "' + password + '" | sudo tee wpa_supplicant.conf'
    exec(cmd, function (error, stdout, stderr) {
        if (error) {
            res.status(200).send('Error occured while connecting to WiFi.')
        }
        else {
            exec('sudo killall wpa_supplicant', function (error, stdout, stderr) {
                if (error) {
                    exec('sudo wpa_supplicant -c wpa_supplicant.conf -i wlan0 -B', function (error, stdout, stderr) {
                        if (error) {
                            res.status(200).send(error)
                        }
                        else {
                            res.status(200).send('Connected to WiFi.')   
                        }
                    });
                }
                else {
                    exec('sudo wpa_supplicant -c wpa_supplicant.conf -i wlan0 -B', function (error, stdout, stderr) {
                        if (error) {
                            res.status(200).send(error)
                        }
                        else {
                            res.status(200).send('Connected to WiFi.')   
                        }
                    });
                }
            });
        }
    });
})

app.post('/set_username_password', (req, res) => {
    var existing_user = req.body.existing_user
    var username = req.body.username;
    var password = req.body.password;
    cmd = 'usermod -l ' + username + ' -d /home/' + username + ' -m ' + existing_user + " && echo " + username + ":" + password + " | sudo chpasswd"
    var exec = require('child_process').exec;
    exec(cmd, function (error, stdout, stderr) {
        //if output contains "is currently used by process"
        if (error && stdout.includes("is currently used by process") || stderr.includes("is currently used by process")) {
            res.status(200).send('User is currently logged in. Please logout or reboot and try again.')
        }
        if (error && stdout.includes("does not exist") || stderr.includes("does not exist")) {
            res.status(200).send('User does not exist.')
        }
        else {
            res.status(200).send('Username and password updated.')
        }
    });
})

app.post('/open_folder', (req, res) => {
    var path = "/storage/0/Videos"
    //check if folder doesn't exist
    var fs = require('fs')
    fs.exists(path, function (exists) {
        if (!exists) {
            //create folder
            fs.mkdir(path, function (err) {
                if (err) {
                    res.status(200).send('Error occured while opening folder.')
                }
            });
        }
    });
    new_port = port + 1
    // run a simple http-server to serve the files in path
    var exec = require('child_process').exec;
    exec('sudo http-server ' + path + ' -p ' + new_port, function (error, stdout, stderr) {
        console.log('serving at http://localhost:' + new_port)
        if (error) {
            res.status(200).send('null')
        }
        else {
            res.status(200).send('http://localhost:' + new_port)
        }
    });
})


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})