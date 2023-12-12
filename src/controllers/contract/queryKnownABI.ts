import { ethers } from "ethers";
import { NextFunction, Request, Response } from "express";

// Services
import contractService from "src/services/contract";
import contractProvider from "src/services/contractProvider";

// Helpers
import { getBlockTagForDate } from "src/helpers/blocktag";
import { abiConverter } from "src/helpers/abiConverter";

// Controllers
import { errorLogger } from "src/controllers/errorLog";

interface QueryKnownABIInput {
  address: string;
  functionName: string;
  params: Record<string, string>;
  blockTag?: number;
  blockDate?: string;
}

const parseInput = (
  params: Record<string, unknown>,
  body: Record<string, unknown>
): QueryKnownABIInput => {
  const address = params.address as string;
  const functionName = body.function as string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const paramsParsed = (body.params as Record<string, any> | undefined) || {};
  const blockTag = body.blockTag ?? undefined;
  const blockDate = body.blockDate as string | undefined;

  // Check if all fields are present
  if (functionName === undefined || functionName === "")
    throw new Error("function must be specified");
  if (blockDate !== undefined && !Date.parse(blockDate))
    throw new Error("Date is not valid");
  if (blockDate !== undefined && blockTag !== undefined)
    throw new Error("Block tag and block date is not valid at the same time");

  return {
    address,
    functionName,
    params: paramsParsed,
    blockTag: blockTag === undefined ? undefined : +blockTag,
    blockDate,
  };
};

const queryKnownABI = async (
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
    const { address, functionName, params, blockTag, blockDate } = parseInput(
      req.params,
      req.body
    );
    // Check contract is known
    const contract = await contractService.getContract(address);
    if (!contract) {
      throw new Error("Contract unknown");
    }

    const abi = abiConverter.parseToJSON(["function balanceOf(address account) view returns (uint256)"]);

    // check params
    const paramsValueArray = abiConverter.parseParams(
      abi,
      functionName,
      params
    );
    

    const blockTagForDate = await getBlockTagForDate(blockDate);
  
    const response = await contractProvider.call({
      address,
      abi,
      functionName,
      params: paramsValueArray,
      blockTag: blockTag ?? blockTagForDate
    })

    const abiFunction = abiConverter.getAbiFunction(abi, functionName);
    const hash = ethers.id(
      functionName + abiFunction.inputs.map((i) => i.type + i.name)
    );

    await contractService.saveFunction(address, abiFunction, hash);

    res.status(200).json({ response: response.toString() });
  } catch (error) {
    const message = await errorLogger((req as any).context, error);
    console.log({ message });
    res.status(400).json({ message: message });
    next(error);
  }
};

export default { queryKnownABI };
