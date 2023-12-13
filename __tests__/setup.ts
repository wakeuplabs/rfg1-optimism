import supertest from "supertest";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const app = require("../src/server");
 
class Server {
  static server: any = null;

  static getServer() {
    if (!Server.server) {
      Server.server = supertest(app);
    }

    return Server.server;
  }
}

module.exports = Server.getServer();
