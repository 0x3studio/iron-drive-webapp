<script lang="ts">
  import { onMount } from "svelte";

  import { browser } from "$app/environment";

  export let data: any;

  let Page: any = null;

  onMount(async () => {
    if (browser) {
      Page = (await import("$lib/pages/File.svelte")).default;
    }
  });
</script>

<svelte:component
  this={Page}
  contractTxId={data.contractTxId}
  uuid={data.uuid}
/>
