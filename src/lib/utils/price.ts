import { chainInfo } from "$lib/utils/chain";
import type { WebBundlr } from "@bundlr-network/client";

export const getPrice = async (bundlr: WebBundlr, chainId: string) => {
  let price = await bundlr.getPrice(1000000000).catch((err) => {
    console.error(err);
    return 0;
  });
  let priceUSD = 0;
  try {
    const response = await fetch(
      `https://api.coinbase.com/v2/exchange-rates?currency=${
        chainInfo(chainId).symbol
      }`
    );
    const json = await response.json();
    const rate = json.data.rates.USD;
    priceUSD = rate * bundlr.utils.unitConverter(price).toNumber();
  } catch (err) {
    console.error(err);
  }

  return { price, priceUSD };
};
