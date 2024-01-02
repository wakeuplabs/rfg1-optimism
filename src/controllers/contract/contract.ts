import { ethers } from "ethers";
import { NextFunction, Request, Response } from "express";

// Models
import {
  AbiLine,
  ensureAbiIsValid,
  UnprocessedAbi,
} from "../../models/contract";
import { CustomError } from "../../models/error";
import { getNetwork, Network } from "../../models/network";

// Services
import functionService from "../../services/function";
import contractProvider from "../../services/contractProvider";

// Helpers
import { abiConverter } from "../../helpers/abiConverter";
import { getBlockTagForDate } from "../../helpers/blocktag";
import { parseResponse } from "../../helpers/ethers";

// Controllers
import { errorLogger } from "../../controllers/errorLog";

interface QueryContractInput {
  address: string;
  unprocessedAbi: UnprocessedAbi;
  functionName: string;
  params: Record<string, string>;
  blockTag?: number;
  blockDate?: string;
  network: Network;
}

const parseInput = (
  params: Record<string, unknown>,
  body: Record<string, unknown>
): QueryContractInput => {
  const address = params.address as string;
  const unprocessedAbi = body.abi as
    | QueryContractInput["unprocessedAbi"]
    | undefined;
  const functionName = body.function as string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const paramsParsed = (body.params as Record<string, any> | undefined) || {};
  const blockTag = body.blockTag ?? undefined;
  const blockDate = body.blockDate as string | undefined;
  const network = getNetwork(body.network as string);

  // Check if all fields are present
  const abiIsArray = Array.isArray(unprocessedAbi);
  const abiIsArrayEmpty = abiIsArray && unprocessedAbi.length === 0;
  if (unprocessedAbi === undefined || abiIsArrayEmpty)
    throw new Error("abi must be specified");
  if (functionName === undefined || functionName === "")
    throw new Error("function must be specified");
  if (blockDate !== undefined && !Date.parse(blockDate))
    throw new Error("Date is not valid");
  if (blockDate !== undefined && blockTag !== undefined)
    throw new Error("Block tag and block date is not valid at the same time");

  return {
    address,
    unprocessedAbi,
    functionName,
    params: paramsParsed,
    blockTag: blockTag === undefined ? undefined : +blockTag,
    blockDate,
    network,
  };
};

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
    const {
      address,
      unprocessedAbi,
      functionName,
      params,
      blockTag,
      blockDate,
      network,
    } = parseInput(req.params, req.body);

    // Convert ABI to JSON format
    const abi: AbiLine[] = abiConverter.parseToJSON(unprocessedAbi);
    ensureAbiIsValid(abi, functionName, params);

    // check params
    const paramsValueArray = abiConverter.parseParams(
      abi,
      functionName,
      params
    );

    const blockTagForDate = await getBlockTagForDate(blockDate, network);

    const provider = contractProvider.getInstance(network);
    const response = await contractProvider.call(provider, {
      address,
      abi,
      functionName,
      params: paramsValueArray,
      blockTag: blockTag ?? blockTagForDate,
    });

    const abiFunction = abiConverter.getAbiFunction(abi, functionName);
    const hash = ethers.id(
      functionName + abiFunction.inputs.map((i) => i.type + i.name)
    );

    await functionService.saveFunction(address, abiFunction, hash, network);

    res.status(200).json({ response: parseResponse(response) });
  } catch (error) {
    returnError(res, (error as CustomError).message);
    errorLogger((req as any).context, error);
    next(error);
  }
};

const returnError = (res: Response, message: string) => {
  res.status(400).json({ message: message });
  return;
};

export { queryContract };
