<script lang="ts">
  import { bundlrStore, chainId } from "$lib/stores";
  import { chainInfo } from "$lib/utils/chain";

  let status: string = "working";
  let price: number;
  let priceUSD: number;

  const getPrice = async () => {
    status = "working";

    price = (await $bundlrStore.getPrice(1000000000)).toNumber();

    try {
      const response = await fetch(
        `https://api.coinbase.com/v2/exchange-rates?currency=${
          chainInfo($chainId).symbol
        }`
      );
      const json = await response.json();
      const rate = json.data.rates.USD;

      priceUSD = rate * $bundlrStore.utils.unitConverter(price).toNumber();
    } catch (err) {
      console.error(err);
    }

    status = "done";
  };

  getPrice();
  setInterval(() => {
    getPrice();
  }, 30000);
</script>

<div>
  <h3>Current price per GB</h3>
  {#if status === "working"}
    <p>Loading...</p>
  {:else}
    <p>
      {$bundlrStore.utils.unitConverter(price).toFixed(10)}
      {chainInfo($chainId).symbol}
      {#if priceUSD}
        (${priceUSD.toFixed(2)})
      {/if}
    </p>
  {/if}
</div>
