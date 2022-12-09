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