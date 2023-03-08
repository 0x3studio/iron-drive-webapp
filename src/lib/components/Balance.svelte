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
      }, 5000);
    } catch (err) {
      fundingStatus = "not_started";
    }
  };
</script>

<div class="balance">
  <h2>Your balance</h2>
  <div class="value">
    <strong>{utils.formatEther(balance.toString()).slice(0, 10)} ETH</strong>
    {#if refreshing}
      <p>...</p>
    {:else}
      <IconButton
        onClick={refreshBalance}
        icon="material-symbols:refresh-rounded">Refresh</IconButton
      >
    {/if}
  </div>
  <div class="action">
    <Button onClick={fund} disabled={fundingStatus !== "not_started"}
      >Fund</Button
    >
  </div>
</div>

{#if fundingStatus !== "not_started"}
  <div class="fund">
    {#if fundingStatus === "working"}
      <p>
        You account is being funded. It can take a few minutes to process. Don't
        close the current window until it's done.
      </p>
    {/if}
    {#if fundingStatus === "done"}
      <p>
        You account has been funded! It can take a few minutes to reflect on
        your balance.
      </p>
    {/if}
  </div>
{/if}

<style>
  .balance {
    display: flex;
    flex-direction: column;
    line-height: 1.25rem;
    border: 2px solid #f9f8f8;
    margin-bottom: 1.25rem;
    padding: 20px;
  }
  .balance h2 {
    font-size: 16px;
    font-weight: 500;
    margin-bottom: 0.25rem;
  }
  .balance .value {
    display: flex;
    align-items: center;
    margin-bottom: 1rem;
    column-gap: 0.25rem;
    line-height: 20px;
  }
  .fund p {
    line-height: 1.4em;
  }
</style>
