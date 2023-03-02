<script lang="ts">
  import { utils } from "ethers";

  import Button from "$lib/components/Button.svelte";
  import IconButton from "$lib/components/IconButton.svelte";

  export let bundlr: any;
  export let balance: any;

  let refreshing: boolean = false;
  let fundingStatus: string = "not_started";

  const refreshBalance = async () => {
    refreshing = true;

    balance = await bundlr.getLoadedBalance();

    setTimeout(() => {
      refreshing = false;
    }, 1000);
  };

  const fund = async () => {
    fundingStatus = "working";
    try {
      await bundlr.fund(100000000000000); // 0.0001 ETH (TODO: people can choose how much they want to fund)
      balance = await bundlr.getLoadedBalance();
      fundingStatus = "done";
      setTimeout(() => {
        fundingStatus = "not_started";
      }, 1000);
    } catch (err) {
      fundingStatus = "not_started";
    }
  };
</script>

<div class="balance">
  <p>
    Your balance: <strong>{utils.formatEther(balance.toString())} ETH</strong>
  </p>
  {#if refreshing}
    <p>Refreshing...</p>
  {:else}
    <IconButton onClick={refreshBalance} icon="material-symbols:refresh-rounded"
      >Refresh</IconButton
    >
  {/if}
</div>

<div class="fund">
  {#if fundingStatus === "not_started"}
    <Button onClick={fund}>Fund</Button>
  {:else if fundingStatus === "working"}
    <p>
      You account is being funded. It can take a few minutes to process. Don't
      close the current window until it's done.
    </p>
  {:else}
    <p>
      You account has been funded! It can take a few minutes to reflect on your
      balance.
    </p>
  {/if}
</div>

<style>
  .balance {
    display: flex;
    align-items: center;
    column-gap: 0.5rem;
    margin-bottom: 20px;
    line-height: 1.25rem;
  }
</style>
