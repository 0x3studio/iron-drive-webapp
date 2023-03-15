<script lang="ts">
  import Icon from "@iconify/svelte";

  export let icon: string;
  export let onClick: any;
</script>

<button on:click={onClick}>
  <Icon {icon} />
</button>

<style>
  button {
    cursor: pointer;
    display: inline-block;
    border: 0;
    background: transparent none;
    font-size: 1.25rem;
    width: 1.25rem;
    height: 1.25rem;
    color: #04cae5;
    transition: all 0.2s ease-in-out;
  }
  button:hover {
    color: #666;
  }
</style>
