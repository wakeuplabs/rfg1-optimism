require("./setup");
const chai = require("chai");
const chaiHttp = require("chai-http");
chai.use(chaiHttp);

const port = process.env.PORT || "6060";
const url = `http://localhost:${port}`;
const expect = chai.expect;
const request = process.env.NODE_ENV !== "testing" ? null : chai.request(url);

const customerID = process.env.CUSTOMER_ID;
const authHeader = { apiKey: process.env.API_KEY_TESTING };

export { expect, request, authHeader, customerID };
