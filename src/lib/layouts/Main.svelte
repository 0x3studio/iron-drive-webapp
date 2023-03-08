<script lang="ts">
  import Account from "$lib/components/Account.svelte";
  import Balance from "$lib/components/Balance.svelte";
  import Button from "$lib/components/Button.svelte";
  import Logo from "$lib/components/Logo.svelte";

  export let account: any;
  export let bundlr: any;
  export let balance: any;
  export let connectBundlr: Function;
</script>

<div class="container">
  <header>
    <Logo />
    <Account {account} />
  </header>

  <main>
    <nav>
      {#if bundlr}
        <Balance {bundlr} {balance} />
      {:else}
        <Button onClick={connectBundlr}>Connect with Bundlr</Button>
      {/if}
    </nav>
    <div class="content">
      <slot />
    </div>
  </main>
</div>

<style>
  .container {
    display: flex;
    flex-direction: column;
    height: 100vh;
  }
  header {
    display: flex;
    justify-content: space-between;
    padding: 20px;
    background-color: #f9f8f8;
    height: 59px;
  }
  main {
    display: flex;
    flex: 1;
  }
  nav {
    width: 250px;
    padding: 20px;
    border-right: 2px solid #f9f8f8;
  }
  .content {
    flex: 1;
  }
</style>
