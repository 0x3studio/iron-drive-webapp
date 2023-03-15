<script lang="ts">
  import Icon from "@iconify/svelte";

  import Account from "$lib/components/Account.svelte";
  import Balance from "$lib/components/Balance.svelte";
  import IconButton from "$lib/components/IconButton.svelte";
  import Logo from "$lib/components/Logo.svelte";

  export let account: any;
  export let bundlr: any;
  export let balance: any;
</script>

<div class="container">
  <header>
    <Logo />
    <Account {account} />
  </header>

  <main>
    <div class="sidebar">
      <div class="nav">
        <div class="section">
          <div class="title">
            <h2>Public</h2>
            <div class="action">
              <IconButton
                icon="material-symbols:create-new-folder-outline"
                onClick={() => {
                  alert("Creating a new folder is not possible yet...");
                }}
              />
            </div>
          </div>
          <nav>
            <ul>
              <li class="selected">
                <Icon icon="material-symbols:folder-outline" />
                <span>My public folder</span>
              </li>
            </ul>
          </nav>
        </div>
        <div class="section">
          <div class="title">
            <h2>Private</h2>
            <div class="action">
              <IconButton
                icon="material-symbols:create-new-folder-outline"
                onClick={() => {
                  alert("Creating a new folder is not possible yet...");
                }}
              />
            </div>
          </div>
          <nav>
            <p>This section is empty.</p>
          </nav>
        </div>
      </div>
      <Balance {bundlr} {balance} />
    </div>
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
    align-items: center;
    padding: 0 20px;
    background-color: #f9f8f8;
    height: 69px;
  }
  main {
    display: flex;
    flex: 1;
  }
  .sidebar {
    width: 250px;
    padding: 20px;
    border-right: 1px solid #f9f8f8;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .content {
    flex: 1;
  }
  .section {
    margin-bottom: 20px;
  }
  .title {
    padding: 10px;
    border-bottom: 1px solid #f9f8f8;
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  h2 {
    font-weight: 500;
    font-size: 16px;
    font-family: "Noto Serif", serif;
  }
  nav ul {
    list-style: none;
  }
  nav li {
    padding: 10px;
    font-size: 14px;
    border-radius: 5px;
    cursor: pointer;
    display: flex;
    align-items: center;
    column-gap: 0.5rem;
  }
  nav li:hover,
  nav li.selected {
    background: #fff6a3;
  }
  nav li.selected {
    font-weight: 500;
  }
  nav p {
    padding: 5px 10px;
    font-size: 14px;
    color: #999;
  }
  .action {
    color: #04cae5;
  }
  .action:hover {
    color: #666;
  }
</style>
