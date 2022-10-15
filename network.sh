#! /usr/bin/bash
ip_address=""
router=""
dns1=""
dns2=""
subnet=""
while IFS="" read -r p || [ -n "$p" ]; do
    if [[ $p == interface\ wlan0* ]]; then
        read -r ip_address || [ -n "$p" ]
        read -r router || [ -n "$p" ]
        read -r dns1 || [ -n "$p" ]
    fi
done < /etc/dhcpcd.conf
#Check if all variables are empty
if [[ -z $ip_address ]] || [[ -z $router ]] || [[ -z $dns1 ]]; then
    echo "DHCP"
else
ip_address=$(echo $ip_address | cut -d '=' -f 2)
router=$(echo $router | cut -d '=' -f 2)
dns1=$(echo $dns1 | cut -d '=' -f 2)
subnet=$(echo $ip_address | cut -d '/' -f 2)
ip_address2=$(echo $ip_address | cut -d '/' -f 1)
dns2=$(echo $dns1 | cut -d ' ' -f 2)
dns1=$(echo $dns1 | cut -d ' ' -f 1)
subnet=$(python3 -c "import ipaddress;netmask=ipaddress.IPv4Address(0xffffffff << (32 - $subnet) & 0xffffffff);print(netmask)")
echo "$ip_address2;$subnet;$router;$dns1;$dns2"
fi