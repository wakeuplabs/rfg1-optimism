/* eslint-disable @typescript-eslint/no-var-requires */
import { expect, request } from "./config";
import sinon from "sinon";

import contractService from "../services/contract";
import functionService from "../services/function";
import { account, contractAddress, contractFound, functionFound } from "./contract.mother";
import { describe, it } from "mocha";
import { Network } from "../models/network";

describe("Query Known ABI", () => {
  const url = `/${contractAddress}/queryKnownABI`;
 
  describe("GET /:address/queryKnownABI", () => {

    describe("Error cases", () => {
      it("Should respond with 400 when no functionName", async () => {
        const body = { network: Network.TESTNET, abi: ["function name() view returns (string)"] };
        const response = await request.put(url).send(body);
        expect(response.statusCode).to.be.equal(400);
        expect(response.body.message).to.be.equal("function must be specified");
      });
      it("Should respond with 400 with invalid date", async () => {
        const body = {
          network: Network.TESTNET,
          function: "name",
          abi: ["function name() view returns (string)"],
          blockDate: "2023-30-30",
        };
        const response = await request.put(url).send(body);
        expect(response.statusCode).to.be.equal(400);
        expect(response.body.message).to.be.equal("Date is not valid");
      });
      it("Should respond with 400 with invalid network", async () => {
        const body = { function: "name", abi: ["function name() view returns (string)"], blockDate: "2023-30-30" };
        const response = await request.put(url).send(body);
        expect(response.statusCode).to.be.equal(400);
        expect(response.body.message).to.be.equal("Network INVALID: undefined");
      });
      it("Should respond with 400 when missing params", async () => {
        const body = {
          network: Network.TESTNET,
          function: "balanceOf",
          abi: ["function balanceOf(address account) view returns (string)"]
        };
        const response = await request.put(url).send(body);
        expect(response.statusCode).to.be.equal(400);
        expect(response.body.message).to.be.equal("Missing params: [account]");
      });
      it("Should respond with 400 when date and block are at the defined same time", async () => {
        const body = {
          network: Network.TESTNET,
          blockDate: "2023-3-3",
          blockTag: 123,
          function: "balanceOf",
          abi: ["function balanceOf(address account) view returns (string)"]
        };
        const response = await request.put(url).send(body);
        expect(response.statusCode).to.be.equal(400);
        expect(response.body.message).to.be.equal("Block tag and block date is not valid at the same time");
      });
      it("Should respond with 400 when contract is not known yet", async () => {
        const getContractUnkonwn = sinon.stub(contractService, 'getContract')
        .returns(Promise.resolve(null));

        const body = {
          network: Network.TESTNET,
          blockDate: "2023-3-3",
          function: "balanceOf",
          abi: ["function balanceOf(address account) view returns (string)"]
        };
        const response = await request.put(url).send(body);
        expect(response.statusCode).to.be.equal(400);
        expect(response.body.message).to.be.equal("Contract unknown");

        getContractUnkonwn.restore();
      });
      it("Should respond with 400 when params are not found", async () => {
        const getContractUnkonwn = sinon.stub(contractService, 'getContract').returns(Promise.resolve(contractFound));
        const getFunctionNotFound = sinon.stub(functionService, 'getFunctionByName').returns(Promise.resolve(null));

        const body = {
          network: Network.TESTNET,
          blockDate: "2023-3-3",
          function: "balanceOf",
          abi: ["function balanceOf(address account) view returns (string)"]
        };
        const response = await request.put(url).send(body);
        expect(response.statusCode).to.be.equal(400);
        expect(response.body.message).to.be.equal("Function not found");

        getContractUnkonwn.restore();
        getFunctionNotFound.restore();
      });
    });

    describe("Happy Path", () => {
      it("Should return correct value", async () => {
        const getContractMock = sinon.stub(contractService, 'getContract').returns(Promise.resolve(contractFound));
        const getFunctionNotFound = sinon.stub(functionService, 'getFunctionByName').returns(Promise.resolve(functionFound as any));

        const body = {
          network: Network.TESTNET,
          function: "balanceOf",
          params: {
            "account": account
          },
          blockTag: 14870075
        };
        const response = await request.put(url).send(body);
        expect(response.statusCode).to.be.equal(200);
        expect(response.body.response[0]).to.be.equal("10000000000000000000000");

        getContractMock.restore()
        getFunctionNotFound.restore();
      });
      it("Should return correct value", async () => {
        const getContractMock = sinon.stub(contractService, 'getContract').returns(Promise.resolve(contractFound));
        const getFunctionNotFound = sinon.stub(functionService, 'getFunctionByName').returns(Promise.resolve(functionFound as any));

        const body = {
          network: Network.TESTNET,
          function: "balanceOf",
          params: {
            "account": account
          },
          blockDate: "2023-09-20T12:03:38"
        };
        const response = await request.put(url).send(body);
        expect(response.statusCode).to.be.equal(200);
        expect(response.body.response[0]).to.be.equal("10000000000000000000000");

        getContractMock.restore()
        getFunctionNotFound.restore();
      });
    })
  })
});