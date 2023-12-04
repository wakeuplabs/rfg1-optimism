import { ethers, TransactionRequest } from "ethers";
import { NextFunction, Request, Response } from "express";

// Utils
import { dater, provider, signer } from "../utils";
// Models
import { AbiLine, ensureAbiIsValid,  UnprocessedAbi } from "../models/contract";
import { CustomError } from "../models/error";
// Services
import contractService from "../services/contract";
// Helpers
import { abiConverter } from "../helpers/abiConverter";


interface QueryContractInput {
  address: string;
  unprocessedAbi: UnprocessedAbi;
  functionName: string;
  params: Record<string, string>;
  blockTag?: number; 
  blockDate?: string;
}

const parseInput = (params: Record<string, unknown>, body: Record<string, unknown>): QueryContractInput => {
  const address = params.address as string;
  const unprocessedAbi = body.abi as QueryContractInput["unprocessedAbi"] | undefined;
  const functionName = body.function as string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const paramsParsed = (body.params as Record<string, any> | undefined) || {};
  const blockTag = body.blockTag ?? undefined;
  const blockDate = body.blockDate as string | undefined;

  // Check if all fields are present
  const abiIsArray =  Array.isArray(unprocessedAbi);
  const abiIsArrayEmpty = abiIsArray && unprocessedAbi.length === 0;
  if (unprocessedAbi === undefined || abiIsArrayEmpty)
    throw new Error("abi must be specified");
  if (functionName === undefined || functionName === "")
    throw new Error("function must be specified");
  if (blockDate !== undefined && !Date.parse(blockDate))
    throw new Error("Date is not valid");

  return {
    address,
    unprocessedAbi,
    functionName,
    params: paramsParsed,
    blockTag: blockTag === undefined ? undefined : +blockTag,
    blockDate
  }
}


const queryContract = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  /*
  #swagger.description = 'Queries `view function` of specified contract'
  #swagger.parameters['address'] = { 
    in: 'path',
    description: 'Address of the contract',
    required: true,
    type: 'string'
  }
  #swagger.requestBody = { 
    required: true,
    schema: { $ref: '#/definitions/QueryContractRequest'}
  }
  #swagger.responses[200] = { 
    "schema": { $ref: '#/definitions/QueryContractResponse' }
  }
  */
  try {
    // todo what happens if you send an abi that is correct except for the return type?
    const { address, unprocessedAbi, functionName, params, blockTag, blockDate } = parseInput(req.params, req.body);

    // Convert ABI to JSON format
    const abi : AbiLine[] = abiConverter.parseToJSON(unprocessedAbi)
    ensureAbiIsValid(abi, functionName, params)

    // check params
    const paramsValueArray = abiConverter.parseParams(abi, functionName, params);

    const contract = new ethers.Contract(address, abi, signer);
    const data = contract.interface.encodeFunctionData(
      functionName,
      paramsValueArray
    );

    // prepare request
    const blockTagForDate = await getBlockTagForDate(blockDate)
    const transactionReq: TransactionRequest = {
      to: address,
      data: data,
      blockTag: blockTag ?? blockTagForDate,
    };

      // make the call
    const result = await provider.call(transactionReq);

    if (result === "0x") {
      return returnError(res, "The contract responded with 0x");
    }

    // todo look into this
    const response = contract.interface.decodeFunctionResult(
      functionName,
      result
    );
    res.status(200).json({ response: response.toString() });

    const abiFunction = abiConverter.getAbiFunction(abi, functionName);
    const hash = ethers.id(
      functionName + abiFunction.inputs.map((i) => i.type + i.name)
    );

    contractService.saveFunction(address, abiFunction, hash);
  } catch (error) {
    returnError(res, (error as CustomError).message);
    next(error);
    return;
  }
};

const getBlockTagForDate = async (date?: string): Promise<number | undefined> => {
  if (!date) {
    return undefined;
  }

  const block = await dater.getDate(date, true, false);
  return block.block;
};

const returnError = (res: Response, message: string) => {
  res.status(400).json({ message: message });
  return;
};

export default { queryContract };
