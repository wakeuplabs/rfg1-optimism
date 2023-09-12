import { Interface, ethers, FormatType } from "ethers";
import { NextFunction, Request, Response } from "express";
import { provider, signer } from "../provider";
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

    // Check if all fields are present
    if (unprocessedAbi === undefined || unprocessedAbi.length === 0)
      return returnError(res, "No abi");
    if (functionName === undefined || functionName === "")
      return returnError(res, "No function");

    // Convert ABI to JSON format
    let stringAbi: string;
    if (typeof unprocessedAbi[0] === "string") {
      const iface = new Interface(unprocessedAbi);
      stringAbi = iface.formatJson();
    } else {
      stringAbi = unprocessedAbi;
    }
    const abi: AbiLine[] = JSON.parse(stringAbi);
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
      // todo some kind of sorting of params (?)
    }
    const contract = new ethers.Contract(address, abi, signer); //todo fijarse de agregar blocktag aca!
    const contractFunction = await contract.getFunction(functionName);
    const response = await contractFunction.staticCall(
      ...Object.values(params)
    );
    // todo improve response
    res.status(200).json({ response: response.toString() });
  } catch (error) {
    next(error);
    return;
  }
};

const returnError = (res: Response, message: string) => {
  res.status(400).json({ message: message });
  return;
};

export default { queryContract };
