import { ethers } from "ethers";

export const parseResponse = (input: ethers.Result) => {
  return input.map(item => {
    return item.toString()
  })
};