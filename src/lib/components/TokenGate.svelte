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
  <div>
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
  }
  img {
    width: 150px;
  }
  .container div {
    display: flex;
    flex-direction: column;
    row-gap: 20px;
  }
</style>
