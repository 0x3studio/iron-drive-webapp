<script lang="ts">
  import { Jumper } from "svelte-loading-spinners";
  import Icon from "@iconify/svelte";
  import { utils } from "ethers";
  import { tooltip } from "svooltip";
  import "svooltip/styles.css";

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
  <div class="title">
    <h3>Funds</h3>
    <div
      class="info"
      use:tooltip={{
        content:
          "You need to fund your account before being able to upload files.<br />Note that files under 100 KB can be uploaded for free.",
        placement: "top",
        html: true,
      }}
    >
      <Icon icon="material-symbols:info-outline" />
    </div>
  </div>
  <div class="value">
    <span
      >{parseFloat(utils.formatEther(balance.toString())).toFixed(10)} ETH</span
    >
    {#if refreshing}
      <Jumper size="20" color="#04cae5" unit="px" duration="1s" />
    {:else}
      <span class="action">
        <IconButton
          onClick={refreshBalance}
          icon="material-symbols:refresh-rounded">Refresh</IconButton
        >
      </span>
    {/if}
  </div>
  <div class="add">
    <Button
      onClick={fund}
      disabled={fundingStatus !== "not_started"}
      icon="material-symbols:add-box-outline">Add funds</Button
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
    padding: 10px;
    background: #f9f8f8;
    border-radius: 10px;
    box-shadow: 0px 4px 9px -4px rgba(0, 0, 0, 0.25);
  }
  .title {
    padding: 10px;
    border-bottom: 1px solid #eee;
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  h3 {
    font-size: 14px;
    font-weight: 500;
    margin-bottom: 0.25rem;
  }
  .value {
    display: flex;
    align-items: center;
    margin-bottom: 1rem;
    column-gap: 0.25rem;
    line-height: 20px;
    font-size: 14px;
    font-weight: 400;
    padding: 0 10px;
  }

  .fund {
    position: absolute;
    left: 0;
    top: 0;
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background: rgba(255, 255, 255, 0.5);
    backdrop-filter: blur(10px);
  }
  .fund p {
    line-height: 1.4em;
    font-size: 16px;
  }
  .info {
    color: #04cae5;
    cursor: help;
  }
  .action {
    color: #04cae5;
    height: 20px;
  }
</style>
