import { Param } from "./param"

export interface ContractFunction {
  id: string;
  contractId: string;
  name: string;
  constant: boolean;
  hash: string;
  createdAt: Date;
  updatedAt: Date;

  params: Param[];
}
