<script lang="ts">
  import { bundlrStore, chainId, pricePerGb } from "$lib/stores";
  import { chainInfo } from "$lib/utils/chain";
  import { getPrice } from "$lib/utils/price";

  let status: string = "working";
  let price: number;
  let priceUSD: number;

  const _getPrice = async () => {
    status = "working";

    const data = await getPrice($bundlrStore, $chainId);
    price = data.price;
    priceUSD = data.priceUSD;
    $pricePerGb.price = price;
    $pricePerGb.priceUSD = priceUSD;
    status = "done";
  };

  _getPrice();
  setInterval(() => {
    _getPrice();
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
