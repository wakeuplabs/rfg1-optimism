const request = require("supertest");
const httpServer = require("../src/server");

describe("Wallet", () => {
  afterAll(() => {
    httpServer.close();
  })

  const address = "0xA1673f6ec41cE19814B412bC633D59e4119eCD17"

  // /:address/balance is not tested because the current balance can change

  describe("GET /:address/balance/:blockNumber", () => {
    it("Should response with no balance on block 1", async () => {
      const blockNumber = 1;
      const expectedBalance = "0"
      const response = await request(httpServer).get(`/${address}/balance/block/${blockNumber}`);
      expect(response.statusCode).toBe(200);
      expect(response.body.balance).toBe(expectedBalance);
    });

    it("Should respond with some balance on block 13428489", async () => {
      const blockNumber = 13428489;
      const expectedBalance = "13957107165217"
      const response = await request(httpServer).get(`/${address}/balance/block/${blockNumber}`);
      expect(response.statusCode).toBe(200);
      expect(response.body.balance).toBe(expectedBalance);
    });
  })

  describe("GET /:address/balance/date/:date", () => {
    it("Should respond with correct balance on date", async () => {
      const date = "2023-08-30"
      const expectedBalance = "13957107165217"
      const response = await request(httpServer).get(`/${address}/balance/date/${date}`);
      expect(response.statusCode).toBe(200);
      expect(response.body.balance).toBe(expectedBalance);
    });
  })

});