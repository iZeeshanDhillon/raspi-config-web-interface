const express = require('express')
const app = express()
const port = 3000

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
    exec('sudo ifconfig wlan0 down && sudo ifconfig wlan0 up', function (error, stdout, stderr) {
        if (error) {
            res.status(200).send('Could not restart wifi interface. Try rebooting the device.')
        }
    });
    //send "done" in response with https status code 200
    res.status(200).send('Static IP set successfully.')

})

app.get('/wifi_status', (req, res) => {
    //Check if file ".wifi" exists
    fs = require('fs')
    fs.exists('.wifi', function (exists) {
        if (exists) {
            //Read file
            fs.readFile('.wifi', 'utf8', function (err, data) {
                if (err) {
                    res.status(200).send('Error occured while reading file.')
                }
                else {
                    res.status(200).send(data)
                }
            });
        } else {
            //Write to file ".wifi"
            fs.writeFile('.wifi', 'ON', function (err) {
                if (err) {
                    res.status(200).send('null')
                }
            });
            exec('sudo ifconfig wlan0 up', function (error, stdout, stderr) {
                if (error) {
                    res.status(200).send('null')
                }
            });
            res.status(200).send('ON')
        }
    }); 
})

app.post('/wifi_toggle', (req, res) => {
    var fs = require('fs')
    var exec = require('child_process').exec;
    target_state = req.body.state
    if (target_state == 'ON') {
        exec('sudo ifconfig wlan0 up && sudo ip link set wlan0 up', function (error, stdout, stderr) {
            if (error) {
                res.status(200).send('null')
            }
        });
        fs.writeFile('.wifi', 'ON', function (err) {
            if (err) {
                res.status(200).send('null')
            }
        });
        res.status(200).send('ON')
    }
    else if (target_state == 'OFF') {
        exec('sudo ifconfig wlan0 down', function (error, stdout, stderr) {
            if (error) {
                res.status(200).send('null')
            }
        });
        fs.writeFile('.wifi', 'OFF', function (err) {
            if (err) {
                res.status(200).send('null')
            }
        });
        res.status(200).send('OFF')
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

app.get('/set_username_password', (req, res) => {
    var username = req.body.username;
    var password = req.body.password;
    var current_username = 'zeeshan'
    
    var exec = require('child_process').exec;
    exec('sudo usermod -l ' + username + ' ' + current_username + ' && mv /home/' + current_username + ' /home/' + username + ' && echo ' + username + ':' + password + ' | sudo chpasswd', function (error, stdout, stderr) {
        if (error) {
            res.status(200).send('Could not change username or password.')
        }
    });
    res.status(200).send('Username and password changed successfully.')
})

app.post('/open_folder', (req, res) => {
    var exec = require('child_process').exec;
    exec('pcmanfm /storage/0/videos', function (error, stdout, stderr) {
        if (error) {
            res.status(200).send('Could not open folder. Please check if it exists. Or run the app as root user.')
        }
        res.status(200).send('done')
    });
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})