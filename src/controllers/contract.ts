import { Interface, ethers, TransactionRequest, Block } from "ethers";
import { NextFunction, Request, Response } from "express";
import { dater, provider, signer } from "../provider";
import { AbiLine } from "../models/contract";

const queryContract = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // todo add swagger comments
  try {
    const address = req.params.address;
    const unprocessedAbi = req.body.abi;
    const functionName = req.body.function;
    const params = req.body.params || {};
    const blockTag = req.body.blockTag;
    const blockDate = req.body.blockDate;

    // Check if all fields are present
    if (unprocessedAbi === undefined || unprocessedAbi.length === 0)
      return returnError(res, "abi must be specified");
    if (functionName === undefined || functionName === "")
      return returnError(res, "function must be specified");
    if (blockDate !== undefined && !Date.parse(blockDate))
      return returnError(res, "Date is not valid");

    // Convert ABI to JSON format
    let abi: AbiLine[];
    if (typeof unprocessedAbi[0] === "string") {
      const iface = new Interface(unprocessedAbi);
      const stringAbi = iface.formatJson();
      abi = JSON.parse(stringAbi);
    } else {
      abi = unprocessedAbi;
    }

    // chech if function is on ABI
    const filteredAbi = abi.filter(
      (e) => e.type == "function" && e.name === functionName
    );
    if (filteredAbi.length === 0)
      return returnError(res, "Selected function not in ABI");
    const abiFunction = filteredAbi[0];

    // chech if function is view
    if (abiFunction.stateMutability !== "view")
      return returnError(res, "Only 'view' functions are supported");

    // check params
    var paramsValueArray: any[] = [];
    if (abiFunction.inputs.length > 0) {
      const paramNames = Object.keys(params);
      const missingParams = abiFunction.inputs.filter(
        (e) => !paramNames.includes(e.name)
      );

      if (missingParams.length > 0)
        return returnError(
          res,
          `Missing params: [${missingParams.map((e) => e.name)}]`
        );

      // Create array of values that is sorted.
      const functionInputNames = abiFunction.inputs.map((i) => i.name);
      paramsValueArray = functionInputNames.map((f) => params[f]);
    }

    const contract = new ethers.Contract(address, abi, signer);
    const data = contract.interface.encodeFunctionData(
      functionName,
      paramsValueArray
    );
    // make the call
    const transactionReq: TransactionRequest = {
      to: address,
      data: data,
    };
    if (blockTag !== undefined) transactionReq.blockTag = blockTag;
    else if (blockDate !== undefined)
      transactionReq.blockTag = await getBlockTagForDate(blockDate);
    console.log(transactionReq);
    const result = await provider.call(transactionReq);
    const response = contract.interface.decodeFunctionResult(
      functionName,
      result
    );
    res.status(200).json({ response: response.toString() });
  } catch (error) {
    next(error);
    return;
  }
};

const getBlockTagForDate = async (date: string): Promise<number> => {
  const block = await dater.getDate(date, true, false);
  return block.block;
};

const returnError = (res: Response, message: string) => {
  res.status(400).json({ message: message });
  return;
};

export default { queryContract };
