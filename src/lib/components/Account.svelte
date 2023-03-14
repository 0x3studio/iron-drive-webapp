<script lang="ts">
  import { onMount } from "svelte";
  import { fetchEnsName } from "@wagmi/core";

  export let account: any;

  let ensName: string | null;

  onMount(async () => {
    ensName = await fetchEnsName({
      address: account,
    });
  });
</script>

<strong>{ensName || account}</strong>

<style>
  strong {
    background: #000;
    color: #fff;
    padding: 0 15px;
    font-size: 14px;
    line-height: 30px;
    border-radius: 15px;
    font-weight: normal;
  }
</style>
