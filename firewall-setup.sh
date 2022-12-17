#!/bin/bash

# https://linux.die.net/man/8/iptables

# Web server
if [ "$1" == "webserver" ]
then
    echo "[VM1] Setting up ifconfig"

    cp -f network-managers/webserver_vm.yaml > /etc/netplan/01-network-manager-all.yaml

# Firewall
elif [ "$1" == "firewall" ]
then    
    echo "[VM2] Setting up ifconfig"

    cp -f network-managers/firewall_vm.yaml > /etc/netplan/01-network-manager-all.yaml

    echo "[VM2] Setting up Firewall"

    echo "[VM2] Setting default policy: DROP all traffic"
    iptables -P INPUT DROP
    iptables -P OUTPUT DROP
    iptables -P FORWARD DROP

    echo "Allowing http and https traffic"
    # Allow incoming from any ip/port 
    iptables -A INPUT -p tcp -m conntrack --ctstate NEW,ESTABLISHED -j ACCEPT
    # Allow outgoing to 192.168.0.2 to 80/443
    #iptables -A OUTPUT -p tcp -d 192.168.0.2 -m multiport --dports 80,443 -m conntrack --ctstate NEW -j ACCEPT  todo: test more specific
    iptables -A OUTPUT -p tcp -m multiport --dports 80,443 -m conntrack --ctstate NEW,ESTABLISHED -j ACCEPT


    echo "Allowing icmp traffic"
    iptables -A INPUT -p icmp -j ACCEPT
    iptables -A OUTPUT -p icmp -j ACCEPT

    echo "Allowing loopback traffic"
    iptables -A INPUT -i lo -j ACCEPT
    iptables -A OUTPUT -o lo -j ACCEPT

    #echo "Allowing internal network to access external network"
    #iptables -A FORWARD -i "ethTODO" -o "ethTODO" -j ACCEPT

    echo "Allowing tcp traffic between web server and database"
    iptables -A FORWARD -p tcp -s 192.168.0.2/24 -d 192.168.1.2/24 --dport 5432 -m conntrack --ctstate NEW,ESTABLISHED -j ACCEPT
    iptables -A FORWARD -p tcp -s 192.168.1.2/24 --sport 5432 -d 192.168.0.2/24 -m conntrack --ctstate NEW,ESTABLISHED -j ACCEPT

    #sh -c 'iptables-save > /etc/iptables/rules.v4'
    #sh -c 'ip6tables-save > /etc/iptables/rules.v6'

# Database
elif [ "$1" == "database" ]
then
    echo "[Database] Setting up ifconfig"

    cp -f network-managers/database_vm.yaml > /etc/netplan/01-network-manager-all.yaml

# Internal user
elif [ "$1" == "internaluser" ]
    echo "[Internal User] Setting up ifconfig"

    cp -f network-managers/internaluser_vm.yaml > /etc/netplan/01-network-manager-all.yaml

else
    echo "Usage: $0 <webserver|firewall|database|internaluser>"
    exit 1
fi

netplan try ; netplan apply