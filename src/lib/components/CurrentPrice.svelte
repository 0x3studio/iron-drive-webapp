<script lang="ts">
  import { chainInfo } from "$lib/utils/chain";

  export let bundlr: any;
  export let chainId: string;

  let status: string = "working";
  let price: number;
  let priceUSD: number;

  const getPrice = async () => {
    status = "working";

    price = await bundlr.getPrice(1000000000);

    try {
      const response = await fetch(
        `https://api.coinbase.com/v2/exchange-rates?currency=${
          chainInfo(chainId).symbol
        }`
      );
      const json = await response.json();
      const rate = json.data.rates.USD;

      priceUSD = rate * bundlr.utils.unitConverter(price);
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
      {bundlr.utils.unitConverter(price).toFixed(10)}
      {chainInfo(chainId).symbol}
      {#if priceUSD}
        (${priceUSD.toFixed(2)})
      {/if}
    </p>
  {/if}
</div>
