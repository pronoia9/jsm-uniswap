import { Goerli } from "@usedapp/core";

export const ROUTER_ADDRESS = '0xAEe67Eb024B91A22Fbf595110Ce88C0715DC8FdD';

export const DAPP_CONFIG = {
  readOnlyChainId: Goerli.chainId,
  readOnlyUrls: {
    [Goerli.chainId]: "https://eth-goerli.g.alchemy.com/v2/i98zBA0AiUQFxM48eKMTN04p8a-Hx8EZ",
  },
};