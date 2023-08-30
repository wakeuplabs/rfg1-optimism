require('dotenv').config()
const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'RFG1-OPTIMISM',
    description: 'RFG1 OPTIMISM'
  },
  host: 'localhost:' + process.env.PORT
};

const outputFile = './swagger.json';
const routes = ['./src/routes/index.ts'];

swaggerAutogen(outputFile, routes, doc);