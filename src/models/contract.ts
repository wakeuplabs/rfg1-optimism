export type AbiLine = {
  type: string;
  name: string;
  constant: boolean;
  stateMutability: string;
  payable: boolean;
  inputs: AbiInput[];
  outpus: AbiInput[];
};

export type AbiInput = {
  type: string;
  name: string;
  indexed: boolean;
};
