# RFG1 - Optimism Grants Council - WakeUp Labs

Welcome to WakeUp Labs' implementation of Request For Grants #1 (RFG1) from the Optimism Grants Council. This Node.js project focuses on querying the Optimism blockchain for specific historical data, enabling users to access any public view function of deployed smart contracts.

## Overview
This service empowers users to query the Optimism blockchain, retrieving information from its inception to the current moment. The project currently functions on both Optimism and Optimism Goerli. It could be extended to any other EVM-compatible blockchains.

## Features
- **Query Functionality**: Query any public view function of smart contracts deployed on Optimism from the first block till now.
- **Open Source**: Entirely open-source implementation under the MIT license.
- **Proof of Concept**: Successfully calls functions on smart contracts based on specific past hours, days, or blocks.
- **API & Testing**: API is developed and tested, ensuring reliable functionality.
  
## Status (as of Dec 6th '23)
- [x] Proof of concept implemented, allowing calls to specific functions on specific contracts within desired timeframes.
- [x] API developed and tested for reliability.
- [x] Feature implemented for generic calls, enabling interaction with any contract or function.
  
## Roadmap
Upcoming enhancements include:
- [ ] Addition of 'Popular Smart Contracts' feature.
- [ ] Implementation of storage for frequently requested data.
- [ ] Streamlined configuration for easier setup and use.
- [ ] Reference implementations for Optimism P Sepolia & other Optimism networks.

## Try It Out
Check out our implementations:
- Optimism Mainnet: [RFG1 Optimism WakeUp Labs](https://rfg1-optimism.wakeuplabs.link)
- Optimism Goerli Testnet: [RFG1 Optimism Testnet WakeUp Labs](https://rfg1-optimism-testnet.wakeuplabs.link/)

## Get Involved
Contributions and feedback are greatly appreciated! Feel free to contribute to this open-source project on [GitHub](https://github.com/WakeUpLabs/RFG1-Optimism-Project).

Thank you for your interest in WakeUp Labs' initiative to leverage the Optimism blockchain for historical data retrieval.

## Local Setup Guide

### Prerequisites
- Node.js installed on your machine
- Git installed for cloning the repository
- PostgreSQL installed and running or any database deployed


### Steps to Run Locally
1. Clone the repository:
   ```bash
   git clone https://github.com/WakeUpLabs/RFG1-Optimism-Project.git
2. Complete the environment variables

```
  URL=
  PORT=
  RPC_URL=
  PRIVATE_KEY=
  DATABASE_URL=
```

- URL: The base URL for the application. If you want to run it locally, it will be set to http://localhost.
- PORT: Specifies the port number on which the server(and swagger) will listen for incoming requests.
- RPC_URL: Refers to the Remote Procedure Call (RPC) endpoint for connecting to the Optimism blockchain. This variable is crucial for interacting with the blockchain, fetching data, or executing transactions.
- PRIVATE_KEY: Represents the private key used for authentication or signing transactions. Ensure that this key is kept confidential and not shared publicly.
- DATABASE_URL: Specifies the URL for connecting to the PostgreSQL database.

3. Run database migrations:

```bash
    npm run migrate
```
4. Install dependencies:

```bash
    npm install
``` 

5. Start the local server:

```bash
    npm run start
``` 
