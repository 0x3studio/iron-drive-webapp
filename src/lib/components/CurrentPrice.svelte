<script lang="ts">
  import { bundlrStore, chainId, pricePerGb } from "$lib/stores";
  import { chainInfo } from "$lib/utils/chain";
</script>

<div>
  <span>1 GB =</span>
  {#if !$pricePerGb.priceUSD}
    <span>...</span>
  {:else}
    <span>
      {#if $pricePerGb.priceUSD}
        ${$pricePerGb.priceUSD.toFixed(2)}
      {/if} |
      {$bundlrStore.utils.unitConverter($pricePerGb.price).toFixed(5)}
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
