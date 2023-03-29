<script lang="ts">
  import { onMount } from "svelte";
  import { chainId, provider } from "$lib/stores";

  export let account: any;
  let ensName: string | null;

  onMount(async () => {
    ensName = $chainId === 1 ? await $provider.lookupAddress(account) : null;
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
