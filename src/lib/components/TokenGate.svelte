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
        }}>Get one now!</Button
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
    max-width: 600px;
    padding: 20px;
    background: #f9f8f8;
    border-radius: 10px;
    box-shadow: 0px 4px 9px -4px rgba(0, 0, 0, 0.25);
  }
  .container p {
    line-height: 1.4em;
    font-size: 16px;
  }
  img {
    width: 180px;
    height: 180px;
    border-radius: 5px;
  }
  .container .content {
    display: flex;
    flex-direction: column;
    row-gap: 20px;
  }
</style>
