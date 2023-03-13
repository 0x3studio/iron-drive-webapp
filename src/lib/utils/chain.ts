export const chainIdToName = (chainId: string) => {
  let chainName;
  switch (chainId) {
    case "0x1": {
      chainName = "ethereum";
      break;
    }
    case "0x89": {
      chainName = "matic";
      break;
    }
    default: {
      chainName = "unknown";
    }
  }
  return chainName;
};
