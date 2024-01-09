import { describe, it } from "mocha";
import { expect, request } from "./config";
import { Chain } from "../models/chain";

describe("Wallet", () => {
  const address = "0xA1673f6ec41cE19814B412bC633D59e4119eCD17"

  // /:address/balance is not tested because the current balance can change

  describe("GET /:address/balance/:blockNumber", () => {
    it("Should response error with no network", async () => {
      const blockNumber = 1;
      const response = await request.get(`/${address}/balance/block/${blockNumber}`);
      expect(response.statusCode).to.be.equal(500);
    });
    it("Should response with no balance on block 1", async () => {
      const blockNumber = 1;
      const expectedBalance = "0"
      const response = await request.get(`/${address}/balance/block/${blockNumber}?blockchain=${Chain.Optimism_Sequoia}`);
      expect(response.statusCode).to.be.equal(200);
      expect(response.body.balance).to.be.equal(expectedBalance);
    });

    it("Should respond with some balance on block 13428489", async () => {
      const blockNumber = 13428489;
      const expectedBalance = "13957107165217"
      const response = await request.get(`/${address}/balance/block/${blockNumber}?blockchain=${Chain.Optimism_Sequoia}`);
      expect(response.statusCode).to.be.equal(200);
      expect(response.body.balance).to.be.equal(expectedBalance);
    });
  })

  describe("GET /:address/balance/date/:date", () => {
    it("Should respond with correct balance on date", async () => {
      const date = "2023-08-30"
      const expectedBalance = "13957107165217"
      const response = await request.get(`/${address}/balance/date/${date}?blockchain=${Chain.Optimism_Sequoia}`);
      expect(response.statusCode).to.be.equal(200);
      expect(response.body.balance).to.be.equal(expectedBalance);
    });
  })

});