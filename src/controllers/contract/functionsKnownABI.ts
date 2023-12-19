import { NextFunction, Request, Response } from "express";

// Services
import functionService from "../../services/function";
import contractService from "../../services/contract";

// Models
import { ContractFunction } from "src/models/function";
import { Param } from "src/models/param";

// Controllers
import { errorLogger } from "../errorLog";

interface ParamResponse {
  name: string;
  type: string;
}

type GetFunctionsKnownABIResponse = {
  name: string;
  params: ParamResponse[];
}[]

const parseFunctions = (input: ContractFunction[]): GetFunctionsKnownABIResponse => {
  const result = input.map((fn) => ({
    name: fn.name,
    params: fn.params.reduce((acc: ParamResponse[], current: Param) => {
      if (current.input) {
        acc.push({
          name: current.name,
          type: current.type,
        })
      }

      return acc;
    },[] as ParamResponse[]),
    outputs: fn.params.reduce((acc: ParamResponse[], current: Param) => {
      if (!current.input) {
        acc.push({
          name: current.name,
          type: current.type,
        })
      }

      return acc;
    },[] as ParamResponse[])
  }));

  return result;
}

const getFunctionsKnownABI = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  /*
  #swagger.description = 'Get the`view function` of known contracts'
  #swagger.parameters['address'] = { 
    in: 'path',
    description: 'Address of the contract',
    required: true,
    type: 'string'
  }
  #swagger.requestBody = { 
    required: false,
  }
  #swagger.responses[200] = { 
    "schema": { $ref: '#/definitions/QueryContractResponse' }
  }
  */
  try {
    const address = req.params.address as string;

    // Check contract is known
    const contract = await contractService.getContract(address);
    if (!contract) {
      throw new Error("Contract unknown");
    }

    const response = await functionService.getFunctions(
      address,
    );

    const responseParsed = parseFunctions(response as unknown as ContractFunction[])

    res.status(200).json(responseParsed);
  } catch (error) {
    const message = await errorLogger((req as any).context, error);
    res.status(400).json({ message: message });
    next(error);
  }
};

export { getFunctionsKnownABI };
