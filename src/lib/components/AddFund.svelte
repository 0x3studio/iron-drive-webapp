<script lang="ts">
  import { bundlrStore, chainId, pricePerGb } from "$lib/stores";
  import { chainInfo } from "$lib/utils/chain";
  import Button from "./Button.svelte";
  let size = 0;
  let price = $chainId === "0x1" ? 0.01 : 1;

  const PRECISION = 8;
  console.log($chainId);

  export let onAdd: Function;

  $: {
    if ($pricePerGb.price) {
      handlePriceChange();
    }
  }

  const handlePriceChange = () => {
    size = parseFloat(
      (
        (price /
          $bundlrStore.utils.unitConverter($pricePerGb.price).toNumber()) *
        1000
      ).toFixed(4)
    );
  };

  const handleSizeChange = () => {
    price = parseFloat(
      (
        (size / 1000) *
        $bundlrStore.utils.unitConverter($pricePerGb.price).toNumber()
      ).toFixed(PRECISION)
    );
  };

  handlePriceChange();
</script>

<div class="title">
  <h3>Add funds</h3>
</div>
<div class="container">
  <div class="entry">
    <input
      step={$chainId === "0x1" ? "0.001" : "0.1"}
      bind:value={price}
      on:input={handlePriceChange}
      type="number"
    />
    <div class="unit">{chainInfo($chainId).symbol}</div>
  </div>
  <div class="tilde">~</div>
  <div class="entry">
    <input
      step="1"
      type="number"
      bind:value={size}
      on:input={handleSizeChange}
    />
    <div class="unit">Mb</div>
  </div>
  <Button
    onClick={() => {
      onAdd(price);
    }}
    icon="logos:metamask-icon">Validate</Button
  >
</div>

<style>
  .title {
    padding: 10px;
    border-bottom: 1px solid #eee;
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  input {
    flex: 0.5;
    flex-grow: 1;
    padding: 0.8rem 0.25rem;
    background: transparent;
    border: transparent;
    border-radius: 0;
    width: 100%;
    outline: none;
  }

  .unit {
    flex: 0.25;
  }
  .entry {
    border: 1px solid rgba(0, 0, 0, 0.1);
    border-radius: 10px;
    display: flex;
    align-items: center;
    padding: 0 0.5rem;
    gap: 0.5rem;
    width: 100%;
  }
  .entry:focus-within {
    border: 1px solid rgba(0, 0, 0, 0.5);
  }

  .container {
    padding: 0.5rem;
    display: flex;
    align-items: center;
    flex-flow: column;
    gap: 0.5rem;
  }

  .tilde {
    line-height: 6px;
    position: relative;
    background: white;
    border: 1px solid #b3b3b3;
    height: 20px;
    width: 20px;
    border-radius: 50%;
    /* padding: 1rem; */
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: -14px;
    margin-bottom: -14px;
    box-shadow: 0px 2 px 2px -1px rgb(0 0 0 / 25%);
  }
</style>
