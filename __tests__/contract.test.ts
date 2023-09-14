
/* eslint-disable @typescript-eslint/no-var-requires */
import 'jest';
const request = require("supertest");
const httpServer = require("../src/server");

describe("Contract", () => {
  afterAll(() => {
    httpServer.close();
  })

  const contractAddress = "0x0"

  describe("GET /:address/query", () => {

    describe("Error cases", () => {
      const expect400andMessage = async (response: any, message: string) => {
        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe(message);
      }

      it("Should response with 400 when no ABI", async () => {
        const body = { function: "name" };
        const response = await request(httpServer).put(`/${contractAddress}/query`).send(body);
        expect400andMessage(response, "abi must be specified")
      });
      it("Should response with 400 when no functionName", async () => {
        const body = { abi: ["function name() view returns (string)"] };
        const response = await request(httpServer).put(`/${contractAddress}/query`).send(body);
        expect400andMessage(response, "function must be specified");
      });
      it("Should response with 400 with invalid date", async () => {
        const body = { function: "name", abi: ["function name() view returns (string)"], blockDate: "2023-30-30" };
        const response = await request(httpServer).put(`/${contractAddress}/query`).send(body);
        expect400andMessage(response, "Date is not valid");
      });
      it("Should response with 400 when selected function is not on ABI", async () => {
        const body = { function: "sum", abi: ["function name() view returns (string)"] };
        const response = await request(httpServer).put(`/${contractAddress}/query`).send(body);
        expect400andMessage(response, "Selected function not in ABI");
      });
      it("Should response with 400 when selected function is not a view function", async () => {
        const body = { function: "sum", abi: ["function sum(uint32 a, uint32 b) returns (string)"] };
        const response = await request(httpServer).put(`/${contractAddress}/query`).send(body);
        expect400andMessage(response, "Only 'view' functions are supported")
      });
      it("Should response with 400 when missing params", async () => {
        const body = { function: "getBalance", abi: ["function getBalance(address account) view returns (string)"] };
        const response = await request(httpServer).put(`/${contractAddress}/query`).send(body);
        expect400andMessage(response, "Missing params: [account]");
      });
    });

    describe("Happy Path", () => {
      it("Should return correct value", async () => { });
      it("Should return correct value when sending blockTag", async () => { });
      it("Should return correct value when sending blockDate", async () => { });
    })
  })
});