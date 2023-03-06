<script lang="ts">
  import { onMount } from "svelte";

  import { browser } from "$app/environment";

  let App: any = null;

  onMount(async () => {
    if (browser) {
      App = (await import("$lib/components/App.svelte")).default;
    }
  });
</script>

<svelte:component this={App} />
