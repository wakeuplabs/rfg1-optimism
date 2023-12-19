import { ethers, formatEther } from "ethers";

export const parseResponse = (input: ethers.Result) => {
  return input.map(item => {
    if (typeof item === "bigint") {
      return Number(formatEther(item));
    }

    return item.toString()
  })
};