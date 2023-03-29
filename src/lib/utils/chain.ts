export const chainInfo = (chainId: number | string) => {
  let info;

  switch (chainId) {
    case 1: {
      info = { name: "ethereum", symbol: "ETH" };
      break;
    }

    case 137: {
      info = { name: "matic", symbol: "MATIC" };
      break;
    }
    default: {
      info = { name: "unknown", symbol: "???" };
    }
  }
  return info;
};
