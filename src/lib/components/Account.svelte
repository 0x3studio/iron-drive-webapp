<script lang="ts">
  export let account: any;
</script>

<div class="container">
  <p>
    Connected with account: <strong>{account}</strong>
  </p>
</div>

<style>
  .container {
    border-bottom: 5px solid #000;
    padding-bottom: 20px;
    margin-bottom: 20px;
  }
  p {
    line-height: 1.4em;
  }
</style>
