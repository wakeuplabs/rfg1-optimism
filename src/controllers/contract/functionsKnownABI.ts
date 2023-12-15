import { NextFunction, Request, Response } from "express";

// Services
import functionService from "../../services/function";
import contractService from "../../services/contract";

// Controllers
import { errorLogger } from "../errorLog";

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
    console.log({ address })

    // Check contract is known
    const contract = await contractService.getContract(address);
    console.log({ contract })
    if (!contract) {
      throw new Error("Contract unknown");
    }

    const response = await functionService.getFunctions(
      address,
    );

    res.status(200).json({ response });
  } catch (error) {
    const message = await errorLogger((req as any).context, error);
    console.log({ message });
    res.status(400).json({ message: message });
    next(error);
  }
};

export { getFunctionsKnownABI };
