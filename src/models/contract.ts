export type UnprocessedAbi = string[] | AbiLine | AbiLine[];

export type AbiLine = {
  type: string;
  name: string;
  constant: boolean;
  stateMutability: string;
  payable: boolean;
  inputs: AbiInput[];
  outputs: AbiInput[];
};

export type AbiInput = {
  type: string;
  name: string;
  indexed: boolean;
};

export const ensureAbiIsValid = (
  abi: AbiLine[],
  functionName: string,
  params: Record<string, string>
): void => {
  // chech if function is on ABI
  const filteredAbi = abi.filter(
    (e) => e.type == "function" && e.name === functionName
  );
  if (filteredAbi.length === 0) {
    throw new Error("Selected function not in ABI");
  }

  const abiFunction = filteredAbi[0];
  // chech if function is view
  if (abiFunction.stateMutability !== "view") {
    throw new Error("Only 'view' functions are supported");
  }

  // check params
  if (abiFunction.inputs.length > 0) {
    const paramNames = Object.keys(params);
    const missingParams = abiFunction.inputs.filter(
      (e) => !paramNames.includes(e.name)
    );

    if (missingParams.length > 0)
      throw new Error(`Missing params: [${missingParams.map((e) => e.name)}]`);
  }
};
