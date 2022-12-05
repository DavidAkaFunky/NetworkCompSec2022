#!/bin/bash

# https://linux.die.net/man/8/iptables

echo "Default policy: DROP all traffic"
iptables -P INPUT DROP
iptables -P OUTPUT DROP
iptables -P FORWARD DROP

# Web server
if [ "$1" == "vm1" ]
then
    echo "VM1 as web server"
    echo "Setting up firewall"

    echo "Allowing http and https traffic"
    iptables -A INPUT -p tcp -m multiport --dports 80,443 -m state --state NEW,ESTABLISHED -j ACCEPT
    iptables -A OUTPUT -p tcp -m multiport --dports 80,443 -m state --state ESTABLISHED -j ACCEPT
    echo "Allowing icmp traffic"
    iptables -A INPUT -p icmp -j ACCEPT
    iptables -A OUTPUT -p icmp -j ACCEPT
    echo "Allowing loopback traffic"
    iptables -A INPUT -i lo -j ACCEPT
    iptables -A OUTPUT -o lo -j ACCEPT
    echo "Allowing internal network to access external network"
    iptables -A FORWARD -i "ethTODO" -o "ethTODO" -j ACCEPT

    sh -c 'iptables-save > /etc/iptables/rules.v4'
    sh -c 'ip6tables-save > /etc/iptables/rules.v6'

    echo "Setting up ifconfig"

    cat network-managers/vm1.yaml > /etc/netplan/01-network-manager-all.yaml

# Database
elif [ "$1" == "vm2" ]
then
    echo "VM2 as database"
    echo "Setting up firewall"

    echo "Allowing tcp traffic between web server and database"
    iptables -A INPUT -p tcp -s "TODO" --sport 1024:65535 -d "TODO"  --dport 5432 -m state --state NEW,ESTABLISHED -j ACCEPT
    iptables -A OUTPUT -p tcp -s "TODO" --sport 5432 -d "TODO" --dport 1024:65535 -m state --state ESTABLISHED -j ACCEPT

    sh -c 'iptables-save > /etc/iptables/rules.v4'
    sh -c 'ip6tables-save > /etc/iptables/rules.v6'

    echo "Setting up ifconfig"

    cat network-managers/vm2.yaml > /etc/netplan/01-network-manager-all.yaml

# Internal user
elif [ "$1" == "vm3" ]
    # todo que regras ?
    echo "VM3 as internal user"

else
    echo "Usage: $0 <vm1|vm2>"
    exit 1
fi