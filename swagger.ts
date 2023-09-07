require('dotenv').config()
const swaggerAutogen = require('swagger-autogen')({ openapi: '3.0.0' });

const doc = {
  info: {
    title: 'RFG1-OPTIMISM',
    description: 'RFG1 OPTIMISM'
  },
  host: process.env.URL + ':' + process.env.PORT,
  components: {
    '@schemas': {
      BalanceResponse: {
        type: 'object',
        properties: {
          address: {
            type: 'string',
            description: 'Address that was queried',
            example: "0xA1673f6ec41cE19814B412bC633D59e4119eCD17"
          },
          balance: {
            type: 'string',
            description: 'Balance that was queried',
            example: "8901123"
          },
        }
      }
    }
  }
};

const outputFile = './swagger.json';
const routes = ['./src/routes/index.ts'];

swaggerAutogen(outputFile, routes, doc).then(() => {
  require("./src/server");
});