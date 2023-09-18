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
