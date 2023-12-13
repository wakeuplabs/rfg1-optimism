require("./setup");
import chai from "chai";
import chaiHttp from "chai-http";
chai.use(chaiHttp);

const port = process.env.PORT || "6060";
const url = `http://localhost:${port}`;
const expect = chai.expect;
const request = chai.request(url);

export { expect, request };
