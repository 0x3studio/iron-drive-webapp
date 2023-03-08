<script lang="ts">
  import Logo from "$lib/components/Logo.svelte";
</script>

<div class="container">
  <Logo size="large" />
  <div class="content">
    <slot />
  </div>
</div>

<style>
  .container {
    display: flex;
    flex-direction: column;
    row-gap: 2rem;
    align-items: center;
    justify-content: center;
    height: 100vh;
  }
  .content {
    min-height: 46px;
  }
</style>
