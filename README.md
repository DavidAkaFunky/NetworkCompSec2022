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

The system architecture is composed by 4 VMs:
- Firewall
- Webserver
- Database
- Internal user

The network is composed of 3 internal networks:
- Firewall <-> Webserver
- Firewall <-> Database
- Firewall <-> Internal user

Communication protection:  
- External user <-> webserver: HTTPS  
- webserver <-> backend: HTTP  
- backend <-> database: TLS  

## Generating Certificate Authority (CA) and necessary certificates

Start by generating the CA key and certificate which will be used to sign the webserver certificate request
```
mkdir openssl && cd openssl
openssl req -x509 -sha256 -days 356 -nodes -newkey rsa:2048 -subj "/CN=192.168.56.101/C=PT/L=Lisboa" -keyout rootCA.key -out rootCA.crt 
```

-x509 self signed certificate instead of a certificate request
-sha256 digest to sign the request
-nodes private key not encrypted
-newkey creates new certificate request and private key
-subj sets the subject name
-keyout filename for private key
-out filename for certificate

Generate the webserver key and create a certificate request with the pre-defined configuration
```
openssl genrsa -out webserver.key
openssl req -new -key webserver.key -out webserver.csr -config webserver.conf
```

Use the CA certificate and key to sign the certificate request of the webserver which generates a webserver certificate
```
openssl x509 -req -in webserver.csr -CA rootCA.crt -CAkey rootCA.key -CAcreateserial -out webserver.crt -days 365 -sha256 -extfile webserver.conf
```

The CA certificate and key should be kept in a USB pen (air-gapped)

Copy the webserver certificate and key to both the webserver and the database.  
Depending on where you generated them, you may drag-and-drop from the local machine to inside the VMs or if they 
were locally generated, just move them to:
```
mv webserver.key /etc/ssl/private/
mv webserver.crt /etc/ssl/certs/
```

## How to configure VMs

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

Apply the firewall rules and make them persistent
```bash
sudo ./firewall-setup.sh <server|firewall|db> 
sudo apt install iptables-persistent
# FOR IPv4
sudo sh -c 'iptables-save > /etc/iptables/rules.v4'
# FOR IPv6
sudo sh -c 'ip6tables-save > /etc/iptables/rules.v6'
```

### Firewall VM

Allow IP forwarding:
```bash
nano /etc/sysctl.conf
#Uncomment net.ipv4.ip_forward=1
```

Test connections:
```
ping 192.168.0.2
ping 192.168.1.2
ping 192.168.2.2
telnet 192.168.1.2 5432   
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

Check that is working:
```bash
systemctl status postgresql
```

Edit `/etc/postgresql/14/main/postgresql.conf`:
```
listen_address = *
ssl = on
ssl_cert_file = '/etc/ssl/certs/webserver.crt'
ssl_key_file = '/etc/ssl/certs/webserver.key'
```

Edit `/etc/postgresql/14/main/pg_hba.conf`: 

```bash
[CONNECTION_TYPE][DATABASE][USER] [ADDRESS]   [METHOD]
 hostssl             all       all    0.0.0.0/0   md5
```

Finally restart postgres:
```bash
systemctl restart postgresql
```

Check that server is listening to port 5432:
```bash
ss -nlt | grep 5432
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

If something goes wrong check the logs:
```bash
tail /var/log/postgresql/postgresql-14-main.log
```

If it complains about permission do:
```bash
chown postgres:ssl-cert /etc/ssl/private/
chown postgres:postgres /etc/ssl/private/webserver.key
chown postgres:ssl-cert /etc/ssl/certs/
chown postgres:postgres /etc/ssl/certs/webserver.crt
```

### Web server

Copy the example file and then populate the .env for the backend:
```bash
cd backend
cp .env.example .env
```
The database options should look like this:
```
PGUSER=postgres
PGPASSWORD=dees
PGHOST=192.168.1.2
PGPORT=5432
PGDATABASE=ncmb
```

To generate the JWT_*_TOKEN:
```
node
require('crypto').randomBytes(64).toString('hex')
```

Run prisma to configure the database:
```bash
npm i
npx prisma migrate dev --name init
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

Build the frontend:
```bash
cd frontend
npm i
npm run build
```