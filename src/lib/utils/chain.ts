export const chainInfo = (chainId: string) => {
  let info;
  switch (chainId) {
    case "0x1": {
      info = { name: "ethereum", symbol: "ETH" };
      break;
    }
    case "0x89": {
      info = { name: "matic", symbol: "MATIC" };
      break;
    }
    default: {
      info = { name: "unknown", symbol: "???" };
    }
  }
  return info;
};
