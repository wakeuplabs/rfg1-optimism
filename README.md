# RFG1 - Optimism Grants Council - WakeUp Labs


This is [WakeUp Labs](https://www.wakeuplabs.io/) implementation of the **Request For Grants #1** ([RFG1](https://app.charmverse.io/op-grants/page-8928491436774362)) from the Optimism Grants Council.

It is a service that will be able to query the blockchain for specific moments in the past. Specifically, the queries will be enabled for **any public view function** of any smart contract deployed on the Optimism blockchain from its first block until the current moment.
It could be extended to any EVM blockchain.

The implementation is fully open source with MIT license.

Here there is a **reference implementation** working on Optimism Goerli:
https://rfg1-optimism.wakeuplabs.link


<br>

**Status Dec 6th '23:**
- [x] Proof of concept that can call even just a single function on a single smart contract at specific hours or days or blocks in the past.
- [x] API & Tests ready
- [x] Add feature for generic calls (any contract and any function can be called)

**Coming up next:**
- [ ] Add Popular Smart contracts feature
- [ ] Storage for popular user requests
- [ ] Easier configuration
- [ ] OP Sepolia & OP Mainnet reference implementations
