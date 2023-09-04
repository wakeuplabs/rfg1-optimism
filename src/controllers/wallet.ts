import { NextFunction, Request, Response } from "express";
import { provider, dater } from "../provider";
import { BalanceResponse } from "../models/wallet";
import { Block } from "ethers";

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
  try {
    const address = req.params.address;

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
  try {
    const address = req.params.address;
    const blockNumber = parseInt(req.params.blockNumber);

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
  try {
    const address = req.params.address;
    const date = Date.parse(req.params.date);

    const block: Block = await dater.getDate(date, true, false);
    const balance: bigint = await provider.getBalance(address, block.number);
    returnBalance(res, address, balance);
  } catch (error) {
    next(error);
    return;
  }
};
export default { getCurrentBalance, getBalanceAtBlock, getBalanceAtDate };
