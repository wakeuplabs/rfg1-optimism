import { Interface } from "ethers";
import { AbiLine, UnprocessedAbi } from "../models/contract";

/**
 * Parses the unprocessed ABI to JSON format.
 * @param unprocessedAbi - Unprocessed ABI data to be parsed.
 * @returns Parsed ABI in JSON format.
 */
const parseToJSON = (unprocessedAbi: UnprocessedAbi): AbiLine[] => {
  if (Array.isArray(unprocessedAbi) && typeof unprocessedAbi[0] === "string") {
    const iface = new Interface(unprocessedAbi);
    const stringAbi = iface.formatJson();
    return JSON.parse(stringAbi);
  }

  if (!Array.isArray(unprocessedAbi)) {
    return [unprocessedAbi];
  }

  return unprocessedAbi as AbiLine[];
}

/**
 * Parses parameters for a specific function based on its ABI definition.
 * @param abi - ABI definition containing function details.
 * @param functionName - Name of the function for which parameters are parsed.
 * @param params - Record containing parameter names and corresponding values.
 * @returns Array of values parsed based on function parameters.
 * @throws Throws an error if there are missing parameters.
 */
const parseParams = (abi: AbiLine[], functionName: string, params: Record<string, string>): any[] => {
  const abiFunction = getAbiFunction(abi, functionName);

  if (abiFunction.inputs.length === 0) {
    return [];
  }

  const paramNames = Object.keys(params);
  const missingParams = abiFunction.inputs.filter(
    (e) => !paramNames.includes(e.name)
  );

  if (missingParams.length > 0) {
    throw new Error(
      `Missing params: [${missingParams.map((e) => e.name)}]`
    );
  }

  // Create an array of values sorted by function input names.
  const functionInputNames = abiFunction.inputs.map((i) => i.name);
  const paramsValueArray = functionInputNames.map((f) => params[f]);

  return paramsValueArray;
}

/**
 * Retrieves the ABI function definition by its name.
 * @param abi - ABI definition containing function details.
 * @param functionName - Name of the function to retrieve.
 * @returns ABI definition of the specified function.
 */
const getAbiFunction = (abi: AbiLine[], functionName: string) => {
  const filteredAbi = abi.filter(
    (e) => e.type == "function" && e.name === functionName
  );  
  const abiFunction = filteredAbi[0];

  return abiFunction
}

/**
 * AbiConverter module containing functions to parse ABI data.
 */
export const abiConverter = {
  parseToJSON,
  parseParams,
  getAbiFunction
}
