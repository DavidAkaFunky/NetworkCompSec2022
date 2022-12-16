# Insurance & Banking: NCMB
## Business context

Nova Caixa Milenar Bancária NCMB is a bank that operates in Portugal since 1900. It has a large portfolio of clients, from individuals to small businesses, and large multi-national organizations. NCMB has a large catalog of products: credit cards, mortgages, and small loans, and acts as a financial broker (allowing customers to trade shares and other assets).

The front-office of the NCMB offers a public website that displays the products and services; a private website in which clients can access their bank account information and subscribe to their products. The information presented on the websites and corresponding features can also be accessed through a mobile app.

A back-office is used by the bank employees to contact the clients, propose new products, and manage the portfolio of the customers (buy and sell financial assets).

The system has integration with external institutions, namely, the Bank of Portugal (to communicate the financial details of the customers) and insurance companies (to promote insurance services that are associated with the loans).

## Security challenges

(i) There are some concerns with the access to the financial information of the clients. The authenticity of the information and the privacy of the clients needs to be assured. It is necessary to provide a Two-Factor Authentication (2FA) mechanism that requires the bank customers to use an alternative device when logging in the bank app.

(ii) The bank allows its clients to subscribe to any product and service remotely. However, there are concerns that both the bank employees and the clients can be impersonated. Also, financial information should be kept private.

(iii) The bank needs to gather and store sensitive information about its clients in different layers. The information systems should allow fine-grained access to the records to the relevant staff (account managers) for some layers. Other users (clerks), can see some other fields of information. There should also be mechanisms in place to allow access in special circumstances, for example, during an audit process.

## Network and system architecture



## Configuration

Update package manager on every machine:
```bash
sudo apt update
sudo apt upgrade
```

Copy the corresponding configuration file:
```bash
cp -f network-managers/<file>.yaml /etc/netplan/01-network-manager.yaml
```

Refresh the network configuration:
```bash
sudo netplan try
sudo netplan apply
```

Apply the firewall rules:
```bash
sudo ./firewall-setup.sh <server|firewall|db> 
```

To have persistent iptables rules:
```bash
sudo apt install iptables-persistent
# FOR IPv4
sudo sh -c 'iptables-save > /etc/iptables/rules.v4'
# FOR IPv6
sudo sh -c 'ip6tables-save > /etc/iptables/rules.v6'
```

## TODO: GERAR CERTIFICADOS
## NGINX ASSUME CERTIFICADOS, CASO NAO TENHA
## USAR PORTA 80 E MUDAR LINKS PARA HTTP

### Firewall

Allow IP forwarding:
```bash
nano /etc/sysctl.conf
#Uncomment net.ipv4.ip_forward=1
```

### Database

Install postgresql:
```bash
sudo wget http://apt.postgresql.org/pub/repos/apt/ACCC4CF8.asc

sudo apt-key add ACCC4CF8.asc

sudo sh -c 'echo "deb http://apt.postgresql.org/pub/repos/apt/ $(lsb_release -cs)-pgdg main" >> /etc/apt/sources.list.d/pgdg.list'

sudo apt -y update

sudo apt -y install postgresql-14
```
Check that postgres is working:

```bash
systemctl status postgresql
```


Edit `/etc/postgresql/14/main/postgresql.conf`: 

```bash
nano /etc/postgresql/14/main/postgresql.conf
```

Change this line to listen to all addresses:

```bash
listen_addresses = '<Database interface->firewall IP address>'
```

Edit `/etc/postgresql/14/main/pg_hba.conf`: 

```bash
nano /etc/postgresql/14/main/pg_hba.conf
```

Append at the end:

```bash
(maybe change md5 -> sha, restrict other parameters)
[CONNECTION_TYPE][DATABASE][USER] [ADDRESS]   [METHOD]
 host             all       all    0.0.0.0/0   md5
```

Restart postgres:
```bash
systemctl restart postgresql
```

Check that server is listening to port 5432:
```bash
ss -nlt | grep 5432
```

```bash
seed@VM:~/.../Project$ ss -nlt | grep 5432
LISTEN  0        244              0.0.0.0:5432           0.0.0.0:*              
LISTEN  0        244                 [::]:5432              [::]:*
```

Run psql:
```bash
sudo -u postgres psql
```

Change password:
```bash
ALTER USER postgres WITH ENCRYPTED PASSWORD 'postgres';
```

Create database with name `ncmb`:

```bash
CREATE DATABASE ncmb;
```
### Web server

Copy the example file and then populate the .env for the backend:
```bash
cd backend
cp .env.example .env
```

To generate the JWT_*_TOKEN:
```
node
require('crypto').randomBytes(64).toString('hex')
```
PGUSER=postgres
PGPASSWORD=postgres
PGHOST=<FIREWALL IP> 
PGPORT=5432
PGDATABASE=ncmb

Setup to prisma
```bash
# Nao tenho a certeza de que mais é preciso
npm i
npx prisma migrate dev --name init
#IMPORTANTE
# TESTAR SE O PRISMA FUNCIONA COM UMA
# BASE DE DADOS REMOTA
# QUE TIPO DE PACOTES ENVIA
```

Start the backend:
```bash
npm run build
npm start
```

Install and configure nginx (1.18.0):
```bash
sudo apt install nginx
rm /etc/nginx/sites-available/default
cp nginx_config /etc/nginx/sites-available/default
sudo systemctl restart nginx
```

Install nvm (0.39.2):
```bash
wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.2/install.sh | bash
```

Or, alternatively:
```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.2/install.sh | bash
```

Install node (16.18.1) and npm (8.19.2):
```bash
nvm install 16.18.1
nvm use 16.18.1
nvm alias default 16.18.1
```

Build and copy the frontend to nginx:
```bash
cd frontend
npm i ## NECESSARY?
npm run build
rm -rf /var/www/html/*
cp -r build /var/www/html
```