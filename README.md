# Insurance & Banking: NCMB

Final grade: 17

## Business context

Nova Caixa Milenar Bancária (NCMB) is a bank that operates in Portugal since 1900. It has a large portfolio of clients, from individuals to small businesses, and large multi-national organizations. NCMB has a large catalog of products: credit cards, mortgages, and small loans, and acts as a financial broker (allowing customers to trade shares and other assets).

The front-office of the NCMB offers a public website that displays the products and services; a private website in which clients can access their bank account information and subscribe to their products. The information presented on the websites and corresponding features can also be accessed through a mobile app.

A back-office is used by the bank employees to contact the clients, propose new products, and manage the portfolio of the customers (buy and sell financial assets).

The system has integration with external institutions, namely, the Bank of Portugal (to communicate the financial details of the customers) and insurance companies (to promote insurance services that are associated with the loans).

## Security challenge

(i) There are some concerns with the access to the financial information of the clients. The authenticity of the information and the privacy of the clients needs to be assured. It is necessary to provide a Two-Factor Authentication (2FA) mechanism that requires the bank customers to use an alternative device when logging in the bank app.

## Network and system architecture

The system architecture is composed by 5 VMs:
- Firewall
- Web server
- Database
- Internal user
- External service

The network is composed of 3 internal networks and 1 host-only network:

|  Internal Network 1        | Internal Network 2      | Internal Network 3       | Host-only       |
|----------------------------|-------------------------|--------------------------|-----------------|
| Firewall (ad. 1)           | Firewall (ad. 2)        | Firewall (ad. 3)         | Firewall (ad. 4)|
| Web server (ad. 1)         | Database (ad. 1)        | Internal user (ad. 1)    | External user   |
|                            |                         |                          | External service|


Who's communicating<sup>1</sup> ? 

|  Entity 1            | Entity 2          | Security protocol |
|----------------------|-------------------|-------------------|
| Internal User        | Web server(nginx) | HTTPS             |
| External user        | Web server(nginx) | HTTPS             |   
| Web server(nginx)    | Backend           | HTTP              |
| Backend              | Database          | TLS               |
| Web server(nginx)    | External server   | HTTPS             |

1: All requests go through the firewall before reaching their destination


# Create the Virtual Machines

In virtual box, create a new VM using the disk given in the first lab class.
Leave the network adpaters as default (Nat in adapter 1, only).

Create 4 more VMs by cloning the first one as in the first lab class.


# How to configure VMs (common steps)

Update package manager:
```bash
sudo apt update
sudo apt upgrade
```

# Database(VM3)

## Postgres instalation

```bash
sudo wget http://apt.postgresql.org/pub/repos/apt/ACCC4CF8.asc
sudo apt-key add ACCC4CF8.asc
sudo sh -c 'echo "deb http://apt.postgresql.org/pub/repos/apt/ $(lsb_release -cs)-pgdg main" >> /etc/apt/sources.list.d/pgdg.list'
sudo apt -y update
sudo apt -y install postgresql-14
```
    
## Configure database

Shut down the VM. 
In `Settigns -> Network` set adapter 1 to Internal Network and name the network `sw2`. 
Make sure the MAC address is unique.

Start the VM again and run the script to configure the network:
```bash
chmod +x vm-setup.sh
sudo ./vm-setup.sh database 
```

Check that postgresql is working:
```bash
systemctl status postgresql
```

Edit `/etc/postgresql/14/main/postgresql.conf`:
```
listen_address = '*''
ssl = on
ssl_cert_file = '/etc/ssl/certs/webserver.crt'
ssl_key_file = '/etc/ssl/private/webserver.key'
```

Edit `/etc/postgresql/14/main/pg_hba.conf`: 

```bash
[CONNECTION_TYPE][DATABASE][USER] [ADDRESS]   [METHOD]
 hostssl             all       all    0.0.0.0/0   md5
```

Copy the following files in the Webserver(VM1) to the Database VM:
```
~/openssl/webserver.crt (on webserver)    to    /etc/ssl/certs/webserver.crt (on database)
~/openssl/webserver.key (on webserver)    to    /etc/ssl/private/webserver.key (on database)
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

Create a super admin
First generate the password hash:
``` 
await require('bcryptjs').hash("password", 10);
```
Then connect to the database and insert the super admin:
```bash
sudo psql -h 192.168.2.2 -p 5432 -U postgres
\c ncmb;
INSERT INTO "Admin"(name, email, password, role) VALUES ('name', 'email','hashedPassword','SUPERADMIN');
```

# TODO: Create user with non super admin privileges

If something goes wrong check the logs:
```bash
tail /var/log/postgresql/postgresql-14-main.log
```

# Firewall(VM2)

To make iptable rules persistent, install:
```bash
sudo apt install iptables-persistent -y
```

Shut down the VM. 

In `Settings -> Network` set adapters as follow: 
```
Adapter 1 -> 
Adapter 2 -> ...
# Complete this 

```
Make sure the MAC address is unique.

Start the VM again and run the script to configure the network:
```bash
chmod +x vm-setup.sh
sudo ./vm-setup.sh database 
```

Allow IP forwarding:
```bash
vi /etc/sysctl.conf
#Uncomment net.ipv4.ip_forward=1
```

Later test connections with:
```
ping 192.168.0.2
ping 192.168.1.2
ping 192.168.2.2
telnet 192.168.1.2 5432   
ping 192.168.56.102
```

# Webserver(VM1)

## Generating Certificate Authority (CA) and necessary certificates for the webserver (WebServer VM)

Start by generating the CA key and certificate which will be used to sign the web server certificate request
```
mkdir openssl && cd openssl
openssl req -x509 -sha256 -days 356 -nodes -newkey rsa:2048 -subj "/CN=192.168.56.101/C=PT/L=Lisboa" -keyout rootCA.key -out rootCA.crt 
```

Compute the SHA1 and MD5 to make available to the client
```
sha1sum rootCA.crt
md5sum rootCA.crt
```

Generate the web server key and create a certificate request with the pre-defined configuration
```
openssl genrsa -out webserver.key
openssl req -new -key webserver.key -out webserver.csr -config ../SIRS2022/openssl-config/webserver.csr.conf 
```

Use the CA certificate and key to sign the certificate request of the web server which generates a certificate
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

## Install recquired tools

Install nvm (0.39.2):
```bash
wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.2/install.sh | bash
```

Or, alternatively:
```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.2/install.sh | bash
```
Restart the shell

Install node (16.18.1) and npm (8.19.2):
```bash
nvm install 16.18.1
nvm use 16.18.1
nvm alias default 16.18.1
```

## Setup Backend

Go to frontend folder and install the recquired packages:
```bash
cd frontend
npm i
```

Go to backend folder and install the recquired packages:
```bash
cd backend
npm i
```

Copy the example file and then populate the .env for the backend:
```bash
cp .env.example .env
```
The database options should look like this:
```
PGUSER=webserver
PGPASSWORD=dees
PGHOST=192.168.1.2
PGPORT=5432
PGDATABASE=ncmb
```

Generate the JWT_*_TOKEN and add it in `.env` file:
```
node
require('crypto').randomBytes(64).toString('hex')
```

Run prisma to configure the database(after configuring Database VM):
```bash
npx prisma migrate dev --name init
```

Install and configure nginx:
```bash
cd ../nginx-config
chmod +x install_config.sh
sudo ./install_config.sh
```

Shut down the VM. 
In `Settigns -> Network` set adapter 1 to Internal Network and name the network `sw1`. 
Make sure the MAC address is unique.

Start the VM again and run the script to configure the network:
```bash
chmod +x vm-setup.sh
sudo ./vm-setup.sh webserver 
```

Start the backend:
```bash
npm run build
npm start
```

Build the frontend:
```bash
npm run build
```

### External service

## Generating Certificate Authority (CA) and necessary certificates for the external service

Start by generating the CA key and certificate which will be used to sign the web server certificate request
```
openssl req -x509 -sha256 -days 356 -nodes -newkey rsa:2048 -subj "/CN=192.168.56.102/C=PT/L=Lisboa" -keyout externalCA.key -out externalCA.crt 
```

Generate the web server key and create a certificate request with the pre-defined configuration
```
openssl genrsa -out externalwebserver.key
openssl req -new -key externalwebserver.key -out externalwebserver.csr -config externalwebserver.conf
```

Use the CA certificate and key to sign the certificate request of the external web server which generates a certificate
```
openssl x509 -req -in externalwebserver.csr -CA externalCA.crt -CAkey externalCA.key -CAcreateserial -out externalwebserver.crt -days 365 -sha256 -extfile externalwebserver.conf
```

Copy the external web server certificate and key to the external web server.  
Depending on where you generated them, you may drag-and-drop from the local machine to inside the VMs or if they 
were locally generated, just move them to:
```
mv externalwebserver.key /etc/ssl/private/
mv externalwebserver.crt /etc/ssl/certs/
```

Copy the example file and then populate the .env for the external service:
```bash
cd external-service
cp .env.example .env
```

Install and configure nginx (1.18.0):
```bash
sudo apt install nginx
rm /etc/nginx/sites-available/default
cp externalservice_config /etc/nginx/sites-available/default
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

Start the backend:
```bash
npm run build
npm start
```
