<script lang="ts">
  import { Jumper } from "svelte-loading-spinners";
  import Icon from "@iconify/svelte";
  import { tooltip } from "svooltip";
  import "svooltip/styles.css";

  import Button from "$lib/components/Button.svelte";
  import IconButton from "$lib/components/IconButton.svelte";

  import { chainInfo } from "$lib/utils/chain";
  import Modal, { getModal } from "./Modal.svelte";
  import { balance, bundlrStore, chainId, pricePerGb } from "$lib/stores";
  import AddFund from "./AddFund.svelte";
  import CurrentPrice from "./CurrentPrice.svelte";
  import { fly } from "svelte/transition";

  let refreshing: boolean = false;
  let fundingStatus: string = "not_started";

  const MULTIPLIER = 1000000000000000000;

  const getDefaultAmount = (chainId: string) => {
    let amount;
    switch (chainId) {
      case "0x1": {
        // 0.001 ETH
        amount = 0.0001;
        break;
      }
      case "0x89": {
        // 0.1 MATIC
        amount = 0.1;
        break;
      }
      default: {
        amount = 0;
      }
    }
    return amount;
  };

  const refreshBalance = async () => {
    refreshing = true;

    $balance = await $bundlrStore.getLoadedBalance();

    setTimeout(() => {
      refreshing = false;
    }, 1000);
  };

  const fund = () => {
    getModal("fund").open();
  };

  const onFundAdd = async (amount: number) => {
    console.log("ADD", amount);
    getModal("fund").close();

    if (amount) {
      if (amount) {
        fundingStatus = "working";
        try {
          await $bundlrStore.fund(amount * MULTIPLIER);
          $balance = await $bundlrStore.getLoadedBalance();
          fundingStatus = "done";
          setTimeout(() => {
            fundingStatus = "not_started";
          }, 5000);
        } catch (err: any) {
          if (err.message.includes("insufficient funds")) {
            alert(
              `You don’t have enough ${
                chainInfo($chainId).symbol
              } in your wallet to fund your account.`
            );
          }
          fundingStatus = "not_started";
        }
      } else {
        alert("This is not a valid amount.");
      }
    }
  };
</script>

<Modal id="fund">
  <AddFund onAdd={onFundAdd} />
</Modal>

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
      >{$bundlrStore.utils.unitConverter($balance).toFixed(10)}
      {chainInfo($chainId).symbol}</span
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
  <div style="margin: .5rem 0;">
    <CurrentPrice />
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
    z-index: 100;
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
    color: var(--color-text-secondary);
    cursor: help;
    transition: all 0.2s ease-in-out;
  }
  .info:hover {
    color: #666;
  }
  :global(.svooltip) {
    padding: 0.8rem;
  }
  .action {
    height: 20px;
  }
</style>
