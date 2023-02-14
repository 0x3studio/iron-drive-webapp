<script lang="ts">
  import { utils } from "ethers";

  export let bundlr: any;
  export let balance: any;

  let fundingStatus: string = "not_started";

  const refreshBalance = async () => {
    balance = await bundlr.getLoadedBalance();
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

<p>
  Your balance: <strong>{utils.formatEther(balance.toString())} ETH</strong>
  <button on:click={refreshBalance}>Refresh</button>
</p>
<p>
  {#if fundingStatus === "not_started"}
    <button on:click={fund}>Fund</button>
  {:else if fundingStatus === "working"}
    You account is being funded. It can take a few minutes to process. Don't
    close the current window until it's done.
  {:else}
    You account has been funded! It can take a few minutes to reflect on your
    balance.
  {/if}
</p>
