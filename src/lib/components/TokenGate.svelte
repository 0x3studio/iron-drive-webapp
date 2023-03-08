<script lang="ts">
  import Button from "./Button.svelte";

  export let name: string;
  export let url: string;
</script>

<div class="container">
  <img
    src="https://arweave.net/dD6BPrOgZzamUWKynJHF1_VSxcVE85FKeZrAVEbkMfQ/166.jpeg"
    alt="JellyBot #166"
  />
  <div class="content">
    <p>
      You must own at least one {name} NFT to access this application.
    </p>
    <p>
      <Button
        onClick={() => {
          window.open(url);
        }}>Get one</Button
      >
    </p>
    <p>Refresh this page when it is done.</p>
  </div>
</div>

<style>
  .container {
    display: flex;
    align-items: center;
    column-gap: 1rem;
    max-width: 800px;
    border: 2px solid #f9f8f8;
    padding: 20px;
  }
  img {
    width: 150px;
    height: 150px;
  }
  .container .content {
    display: flex;
    flex-direction: column;
    row-gap: 20px;
  }
</style>
