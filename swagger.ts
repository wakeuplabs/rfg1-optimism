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
            example: '0xA1673f6ec41cE19814B412bC633D59e4119eCD17'
          },
          balance: {
            type: 'string',
            description: 'Balance that was queried',
            example: '8901123'
          },
        }
      },
      QueryContractRequest: {
        type: 'object',
        properties: {
          function: {
            type: 'string',
            description: 'Name of the function to call',
            example: 'balanceOf'
          },
          abi: {
            description: 'Accepts a human readable ABI or a JSON ABI',
            oneOf: [
              { $ref: '#/components/schemas/HumanReadableAbi' },
              { $ref: '#/components/schemas/JSONAbi' },
            ]
          },
          params: {
            type: 'object',
            description: 'Neccesary parameters for the function',
            example: {
              balanceOf: '0x0'
            }
          },
          blockTag: {
            type: 'number',
            description: 'BlockTag number for when to query the function',
            example: 4312
          },
          blockDate: {
            type: 'string',
            description: 'Date for when to query the function',
            example: '2023-09-01T15:03:23'
          }
        },
        required: ['function', 'abi']
      },
      QueryContractKnownABIRequest: {
        type: 'object',
        properties: {
          function: {
            type: 'string',
            description: 'Name of the function to call',
            example: 'balanceOf'
          },
          params: {
            type: 'object',
            description: 'Neccesary parameters for the function',
            example: {
              balanceOf: '0x0'
            }
          },
          blockTag: {
            type: 'number',
            description: 'BlockTag number for when to query the function',
            example: 4312
          },
          blockDate: {
            type: 'string',
            description: 'Date for when to query the function',
            example: '2023-09-01T15:03:23'
          }
        },
        required: ['function']
      },
      HumanReadableAbi: {
        type: 'array',
        items: {
          type: 'string'
        },
        example: ['function balanceOf(address account) view returns (uint256)']
      },
      JSONAbi: {
        type: 'object',
        example: {
          'inputs': [
            {
              'internalType': 'address',
              'name': 'account',
              'type': 'address'
            }
          ],
          'name': 'balanceOf',
          'outputs': [
            {
              'internalType': 'uint256',
              'name': '',
              'type': 'uint256'
            }
          ],
          'stateMutability': 'view',
          'type': 'function'
        }
      },
      QueryContractResponse: {
        type: 'object',
        properties: {
          response: {
            type: 'string',
            description: 'Function response',
            example: "0"
          },
        }
      },
    },
  },
};

const outputFile = './swagger.json';
const routes = ['./src/routes/index.ts'];

swaggerAutogen(outputFile, routes, doc).then(() => {
  require('./src/server');
});