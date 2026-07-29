import abi from "./abi.json";

const configuredAddress = process.env.NEXT_PUBLIC_LOTTERY_CONTRACT_ADDRESS;

export const LOTTERY_PROJECT_IS_CONFIGURED =
  /^0x[a-fA-F0-9]{40}$/.test(configuredAddress || "") &&
  configuredAddress !== "0x0000000000000000000000000000000000000000";

// Wagmi requires an address-shaped value even while reads are disabled.
export const LOTTERY_PROJECT_CONTRACT_ADDRESS = LOTTERY_PROJECT_IS_CONFIGURED
  ? configuredAddress
  : "0x0000000000000000000000000000000000000000";
export const LOTTERY_PROJECT_ABI = abi;
