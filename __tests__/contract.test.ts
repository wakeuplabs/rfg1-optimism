
/* eslint-disable @typescript-eslint/no-var-requires */
import 'jest';
const request = require("supertest");
const httpServer = require("../src/server");
// TODO mock db calls
describe("Contract", () => {
  afterAll(() => {
    httpServer.close();
  })

  const contractAddress = "0x50e67cac82fA0e67F456B6536ea609103DfDa98B"
  const account = "0x5Dda4e44d1C4fAb2704A9557509Db94EB4c27CD2"

  describe("GET /:address/query", () => {

    describe("Error cases", () => {
      it("Should respond with 400 when no ABI", async () => {
        const body = { function: "name" };
        const response = await request(httpServer).put(`/${contractAddress}/query`).send(body);
        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe("abi must be specified")
      });
      it("Should respond with 400 when no functionName", async () => {
        const body = { abi: ["function name() view returns (string)"] };
        const response = await request(httpServer).put(`/${contractAddress}/query`).send(body);
        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe("function must be specified");
      });
      it("Should respond with 400 with invalid date", async () => {
        const body = { function: "name", abi: ["function name() view returns (string)"], blockDate: "2023-30-30" };
        const response = await request(httpServer).put(`/${contractAddress}/query`).send(body);
        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe("Date is not valid");
      });
      it("Should respond with 400 when selected function is not on ABI", async () => {
        const body = { function: "sum", abi: ["function name() view returns (string)"] };
        const response = await request(httpServer).put(`/${contractAddress}/query`).send(body);
        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe("Selected function not in ABI");
      });
      it("Should respond with 400 when selected function is not a view function", async () => {
        const body = { function: "sum", abi: ["function sum(uint32 a, uint32 b) returns (string)"] };
        const response = await request(httpServer).put(`/${contractAddress}/query`).send(body);
        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe("Only 'view' functions are supported")
      });
      it("Should respond with 400 when missing params", async () => {
        const body = { function: "balanceOf", abi: ["function balanceOf(address account) view returns (string)"] };
        const response = await request(httpServer).put(`/${contractAddress}/query`).send(body);
        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe("Missing params: [account]");
      });

      it("Should alter contract responded with 0x when sending blockTag before creation", async () => {
        const body = {
          function: "balanceOf",
          abi: ["function balanceOf(address account) view returns (string)"],
          params: {
            "account": account
          },
          blockTag: 14870074
        };
        const response = await request(httpServer).put(`/${contractAddress}/query`).send(body);
        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe("The contract responded with 0x");
      });

    });

    describe("Happy Path", () => {
      it("Should return correct value", async () => {
        const body = {
          function: "balanceOf",
          abi: ["function balanceOf(address account) view returns (uint256)"],
          params: {
            "account": account
          },
          blockTag: 14870075
        };
        const response = await request(httpServer).put(`/${contractAddress}/query`).send(body);
        expect(response.statusCode).toBe(200);
        expect(response.body.response).toBe("10000000000000000000000");
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
        const response = await request(httpServer).put(`/${contractAddress}/query`).send(body);
        expect(response.statusCode).toBe(200);
        expect(response.body.response).toBe("10000000000000000000000");
      });

      it("Should return correct value when sending blockDate", async () => {
        const body = {
          function: "balanceOf",
          abi: ["function balanceOf(address account) view returns (uint256)"],
          params: {
            "account": account
          },
          blockDate: "2023-09-20T12:03:38"
        };
        const response = await request(httpServer).put(`/${contractAddress}/query`).send(body);
        expect(response.statusCode).toBe(200);
        expect(response.body.response).toBe("10000000000000000000000");
      });
    })
  })
});