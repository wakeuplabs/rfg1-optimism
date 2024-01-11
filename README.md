# RFG1 - Optimism Grants Council - WakeUp Labs

Welcome to WakeUp Labs' implementation of RFG1 from the Optimism Grants Council! Our service allows you to query the blockchain for specific past moments. Here's how you can get started:

## Introduction

Learn more about WakeUp Labs [here](https://www.wakeuplabs.io/)' and explore our implementation of Request For Grants #1 (([RFG1](https://app.charmverse.io/op-grants/page-8928491436774362))) from the Optimism Grants Council. Our service is fully open-source with an MIT license.

<br>

**Features:**
- Proof of concept that can call even just a single function on a single smart contract at specific hours or days or blocks in the past.
- API & Tests ready
- Add feature for generic calls (any contract and any function can be called)
- Add Popular Smart contracts feature
- Storage for popular user requests
- OP Sepolia & OP Mainnet reference implementations

## Try It Out

### Local Setup Guide

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
    RPC_TESTNET_URL=
    RPC_MAINNET_URL=
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
