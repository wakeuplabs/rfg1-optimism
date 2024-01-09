import { NextFunction, Request, Response } from "express";

// Models
import { BalanceResponse } from "../models/wallet";
import { getChain } from "../models/chain";

// Services
import contractProvider from "../services/contractProvider";
import { daterProvider } from "../services/daterProvider";

const returnBalance = (res: Response, address: string, balance: bigint) => {
  const balanceResponse: BalanceResponse = {
    address: address,
    balance: balance.toString(),
  };
  res.status(200).json(balanceResponse);
};

const getCurrentBalance = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  /* 
  #swagger.description = 'Gets current balance of wallet'
  #swagger.parameters['address'] = {
    in: 'path',
    description: 'Address to search',
    required: true,
    type: 'string'
  }
  #swagger.responses[200] = { 
    "schema": { $ref: '#/definitions/BalanceResponse' }
  }
  */
  try {
    const address = req.params.address;
    const blockchain = getChain(req.query.blockchain as string);

    const provider = contractProvider.getInstance(blockchain);
    const balance: bigint = await provider.getBalance(address);
    returnBalance(res, address, balance);
  } catch (error) {
    next(error);
    return;
  }
};

const getBalanceAtBlock = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  /* 
  #swagger.description = 'Gets balance of wallet at specific block'
  #swagger.parameters['address'] = { 
    in: 'path',
    description: 'Address to search',
    required: true,
    type: 'string'
  },
  #swagger.parameters['blockNumber'] = { 
    in: 'path',
    description: 'Block to search',
    required: true,
    type: 'number'
  }
  #swagger.responses[200] = { 
    "schema": { $ref: '#/definitions/BalanceResponse' }
  }
  */
  try {
    const address = req.params.address;
    const blockNumber = parseInt(req.params.blockNumber);
    const blockchain = getChain(req.query.blockchain as string);

    const provider = contractProvider.getInstance(blockchain)
    const balance: bigint = await provider.getBalance(address, blockNumber);
    returnBalance(res, address, balance);
  } catch (error) {
    next(error);
    return;
  }
};

const getBalanceAtDate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  /*
  #swagger.description = 'Gets balance of wallet near date'
  #swagger.parameters['address'] = { 
    in: 'path',
    description: 'Address to search',
    required: true,
    type: 'string'
  }
  #swagger.parameters['date'] = { 
    in: 'path',
    description: 'Date to search (YYYY-MM-DDThh:mm:ss)',
    required: true,
    type: 'string'
  }
  #swagger.responses[200] = { 
    "schema": { $ref: '#/definitions/BalanceResponse' }
  }
  */
  try {
    const address = req.params.address;
    const date = new Date(req.params.date);
    const blockchain = getChain(req.query.blockchain as string);

    const provider = contractProvider.getInstance(blockchain)
    const dater = daterProvider.getDater(provider)

    const block: EthDater.BlockResult = await dater.getDate(date, true, false);

    const balance: bigint = await provider.getBalance(address, block.block);
    returnBalance(res, address, balance);
  } catch (error) {
    next(error);
    return;
  }
};
export default { getCurrentBalance, getBalanceAtBlock, getBalanceAtDate };
