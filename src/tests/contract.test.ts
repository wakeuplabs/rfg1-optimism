import { expect, request } from "./config";
import functionService from '../services/function';
import Sinon from "sinon";
import { describe, it } from "mocha";
import { Chain } from "../models/chain";

Sinon.stub(functionService, 'saveFunction').returns(Promise.resolve());

describe("Contract", () => {
  const contractAddress = "0x50e67cac82fA0e67F456B6536ea609103DfDa98B"
  const account = "0x5Dda4e44d1C4fAb2704A9557509Db94EB4c27CD2"

  describe("GET /:address/query", () => {

    describe("Error cases", () => {
      it("Should respond with 400 when no ABI", async () => {
        const body = { function: "name", blockchain: Chain.Optimism_Sepolia };
        const response = await request.put(`/${contractAddress}/query`).send(body);
        expect(response.statusCode).to.be.equal(400);
        expect(response.body.message).to.be.equal("abi must be specified")
      });
      it("Should respond with 400 when no network", async () => {
        const body = { abi: ["function name() view returns (string)"] };
        const response = await request.put(`/${contractAddress}/query`).send(body);
        expect(response.statusCode).to.be.equal(400);
        expect(response.body.message).to.be.equal("Network INVALID: undefined");
      });
      it("Should respond with 400 when no functionName", async () => {
        const body = { blockchain: Chain.Optimism_Sepolia, abi: ["function name() view returns (string)"] };
        const response = await request.put(`/${contractAddress}/query`).send(body);
        expect(response.statusCode).to.be.equal(400);
        expect(response.body.message).to.be.equal("function must be specified");
      });
      it("Should respond with 400 with invalid date", async () => {
        const body = {
          blockchain: Chain.Optimism_Sepolia,
          function: "name",
          abi: ["function name() view returns (string)"],
          blockDate: "2023-30-30"
        };
        const response = await request.put(`/${contractAddress}/query`).send(body);
        expect(response.statusCode).to.be.equal(400);
        expect(response.body.message).to.be.equal("Date is not valid");
      });
      it("Should respond with 400 when selected function is not on ABI", async () => {
        const body = {
          blockchain: Chain.Optimism_Sepolia,
          function: "sum",
          abi: ["function name() view returns (string)"]
        };
        const response = await request.put(`/${contractAddress}/query`).send(body);
        expect(response.statusCode).to.be.equal(400);
        expect(response.body.message).to.be.equal("Selected function not in ABI");
      });
      it("Should respond with 400 when selected function is not a view function", async () => {
        const body = {
          blockchain: Chain.Optimism_Sepolia,
          function: "sum",
          abi: ["function sum(uint32 a, uint32 b) returns (string)"]
        };
        const response = await request.put(`/${contractAddress}/query`).send(body);
        expect(response.statusCode).to.be.equal(400);
        expect(response.body.message).to.be.equal("Only 'view' functions are supported")
      });
      it("Should respond with 400 when missing params", async () => {
        const body = {
          blockchain: Chain.Optimism_Sepolia,
          function: "balanceOf",
          abi: ["function balanceOf(address account) view returns (string)"]
        };
        const response = await request.put(`/${contractAddress}/query`).send(body);
        expect(response.statusCode).to.be.equal(400);
        expect(response.body.message).to.be.equal("Missing params: [account]");
      });

      it("Should alter contract responded with 0x when sending blockTag before creation", async () => {
        const body = {
          blockchain: Chain.Optimism_Sepolia,
          function: "balanceOf",
          abi: ["function balanceOf(address account) view returns (string)"],
          params: {
            "account": account
          },
          blockTag: 14870074
        };
        const response = await request.put(`/${contractAddress}/query`).send(body);
        expect(response.statusCode).to.be.equal(400);
        expect(response.body.message).to.be.equal("The contract responded with 0x");
      });

    });

    describe("Happy Path", () => {
      it("Should return correct value", async () => {
        const body = {
          blockchain: Chain.Optimism_Sepolia,
          function: "balanceOf",
          abi: ["function balanceOf(address account) view returns (uint256)"],
          params: {
            "account": account
          },
          blockTag: 14870075
        };
        const response = await request.put(`/${contractAddress}/query`).send(body);
        expect(response.statusCode).to.be.equal(200);
        expect(response.body.response[0]).to.be.equal("10000000000000000000000");
      });

      it("Should return correct value with JSON Abi", async () => {
        const body = {
          blockchain: Chain.Optimism_Sepolia,
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
        const response = await request.put(`/${contractAddress}/query`).send(body);
        expect(response.statusCode).to.be.equal(200);
        expect(response.body.response[0]).to.be.equal("10000000000000000000000");
      });

      it("Should return correct value when sending blockDate", async () => {
        const body = {
          blockchain: Chain.Optimism_Sepolia,
          function: "balanceOf",
          abi: ["function balanceOf(address account) view returns (uint256)"],
          params: {
            "account": account
          },
          blockDate: "2023-09-20T12:03:38"
        };
        const response = await request.put(`/${contractAddress}/query`).send(body);
        expect(response.statusCode).to.be.equal(200);
        expect(response.body.response[0]).to.be.equal("10000000000000000000000");
      });
    })
  })
});