<script lang="ts">
  import { onMount } from "svelte";

  import { browser } from "$app/environment";

  let Page: any = null;

  onMount(async () => {
    if (browser) {
      Page = (await import("$lib/pages/Dashboard.svelte")).default;
    }
  });
</script>

<svelte:component this={Page} />
