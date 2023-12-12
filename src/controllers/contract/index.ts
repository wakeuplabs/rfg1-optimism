import queryContract from "./contract";
import queryKnownABI from "./queryKnownABI";

export default {
  ...queryContract,
  ...queryKnownABI,
};
