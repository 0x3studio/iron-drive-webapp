import type { WebBundlr } from "@bundlr-network/client";

import { writable, type Writable } from "svelte/store";
import type BigNumber from "bignumber.js";

export const bundlrStore: Writable<WebBundlr> = writable();
export const balance: Writable<BigNumber> = writable();
export const chainId: Writable<string> = writable();
