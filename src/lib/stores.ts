import type { WebBundlr } from "@bundlr-network/client";

import { get, writable, type Writable } from "svelte/store";
import type BigNumber from "bignumber.js";
import { getPrice } from "./utils/price";
import type { Timeout } from "svooltip/types";
import type { providers } from "ethers";

export const bundlrStore: Writable<WebBundlr> = writable();
export const balance: Writable<BigNumber> = writable();
export const chainId: Writable<number> = writable();
export const provider: Writable<providers.Web3Provider> = writable();

function createPricePerGb() {
  let id: null | Timeout = null;
  const { subscribe, set, update } = writable({ price: 0, priceUSD: 0 });
  console.log("SUBSCRIBE", subscribe);
  bundlrStore.subscribe((bundlr) => {
    if (bundlr) {
      const updatePrice = async () => {
        if (bundlr) {
          const _chainId = get(chainId);
          const data = await getPrice(bundlr, _chainId);
          const price = data.price;
          const priceUSD = data.priceUSD;
          console.log("UPDATE PRICE", bundlr, _chainId, price, priceUSD);
          update(() => ({ price, priceUSD }));
        }
      };
      updatePrice();
      if (id) clearInterval(id);
      id = setInterval(() => {
        updatePrice();
      }, 30000);
    }
  });

  return {
    set,
    update,
    subscribe,
  };
}

export const pricePerGb = createPricePerGb();
