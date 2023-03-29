<script lang="ts">
  import { bundlrStore, chainId, pricePerGb } from "$lib/stores";
  import { chainInfo } from "$lib/utils/chain";
  import { getPrice } from "$lib/utils/price";
  import { onDestroy } from "svelte";

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
  const interval = setInterval(() => {
    _getPrice();
  }, 30000);

  onDestroy(() => {
    clearInterval(interval);
  });
</script>

<div>
  <span>1 GB =</span>
  {#if status === "working"}
    <span>...</span>
  {:else}
    <span>
      {#if priceUSD}
        ${priceUSD.toFixed(2)}
      {/if} |
      {$bundlrStore.utils.unitConverter(price).toFixed(5)}
      {chainInfo($chainId).symbol}
    </span>
  {/if}
</div>

<style>
  div {
    font-size: 13px;
    color: rgba(0, 0, 0, 0.5);
    padding: 0.5rem;
    width: 100%;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    background: #8080801f;
    border-radius: 10px;
  }
</style>
