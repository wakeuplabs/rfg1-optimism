/* eslint-disable @typescript-eslint/no-var-requires */
import { expect, request } from "./config";
import sinon from "sinon";

import contractService from "../src/services/contract";

describe("Query Known ABI", () => {
  const contractAddress = "0x50e67cac82fA0e67F456B6536ea609103DfDa98B"
  const account = "0x5Dda4e44d1C4fAb2704A9557509Db94EB4c27CD2"
  const url = `/${contractAddress}/queryKnownABI`;
 
  describe("GET /:address/queryKnownABI", () => {

    describe("Error cases", () => {
      it("Should respond with 400 when no functionName", async () => {
        const body = { abi: ["function name() view returns (string)"] };
        const response = await request.put(url).send(body);
        expect(response.statusCode).to.be.equal(400);
        expect(response.body.message).to.be.equal("function must be specified");
      });
      it("Should respond with 400 with invalid date", async () => {
        const body = { function: "name", abi: ["function name() view returns (string)"], blockDate: "2023-30-30" };
        const response = await request.put(url).send(body);
        expect(response.statusCode).to.be.equal(400);
        expect(response.body.message).to.be.equal("Date is not valid");
      });
      it("Should respond with 400 when missing params", async () => {
        const body = { function: "balanceOf", abi: ["function balanceOf(address account) view returns (string)"] };
        const response = await request.put(url).send(body);
        expect(response.statusCode).to.be.equal(400);
        expect(response.body.message).to.be.equal("Missing params: [account]");
      });
      it("Should respond with 400 when date and block are at the defined same time", async () => {
        const body = {
          blockDate: "2023-3-3",
          blockTag: 123,
          function: "balanceOf", abi: ["function balanceOf(address account) view returns (string)"] };
        const response = await request.put(url).send(body);
        expect(response.statusCode).to.be.equal(400);
        expect(response.body.message).to.be.equal("Block tag and block date is not valid at the same time");
      });
      it("Should respond with 400 when contract is not known yet", async () => {
        const getContractUnkonwn = sinon.stub(contractService, 'getContract')
        .returns(Promise.resolve(null));

        const body = {
          blockDate: "2023-3-3",
          function: "balanceOf",
          abi: ["function balanceOf(address account) view returns (string)"]
        };
        const response = await request.put(url).send(body);
        expect(response.statusCode).to.be.equal(400);
        expect(response.body.message).to.be.equal("Contract unknown");

        getContractUnkonwn.restore();
      });
    });

    describe.skip("Happy Path", () => {
      it("Should return correct value", async () => {
        const body = {
          function: "balanceOf",
          params: {
            "account": account
          },
          blockTag: 14870075
        };
        const response = await request.put(url).send(body);
        expect(response.statusCode).to.be.equal(200);
        expect(response.body.response).to.be.equal("10000000000000000000000");
      });

      it("Should return correct value with JSON Abi", async () => {
        const body = {
          function: "balanceOf",
          abi: {
            "inputs": [
              {
                "internalType": "address",
                "name": "account",
                "type": "address"
              }
            ],
            "name": "balanceOf",
            "outputs": [
              {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
              }
            ],
            "stateMutability": "view",
            "type": "function"
          },
          params: {
            "account": account
          },
          blockTag: 14870075
        };
        const response = await request.put(url).send(body);
        expect(response.statusCode).to.be.equal(200);
        expect(response.body.response).to.be.equal("10000000000000000000000");
      });

      it("Should return correct value when sending blockDate", async () => {
        const body = {
          function: "balanceOf",
          params: {
            "account": account
          },
          blockDate: "2023-09-20T12:03:38"
        };
        const response = await request.put(url).send(body);
        expect(response.statusCode).to.be.equal(200);
        expect(response.body.response).to.be.equal("10000000000000000000000");
      });
    })
  })
});