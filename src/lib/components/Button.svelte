<script lang="ts">
  export let onClick: any;
  export let disabled: boolean = false;
</script>

<button on:click={onClick} {disabled}>
  <slot />
</button>

<style>
  button {
    font-size: 14px;
    font-weight: 500;
    padding: 13px 20px 13px;
    outline: 0;
    border: 1px solid #e4e4e4;
    cursor: pointer;
    position: relative;
    background-color: #fff;
    user-select: none;
    -webkit-user-select: none;
    touch-action: manipulation;
    font-family: inherit;
    border-radius: 10px;
    width: 100%;
    transition: all 0.2s ease-in-out;
  }
  button:hover {
    color: #666;
  }
  button:disabled {
    pointer-events: none;
    opacity: 0.5;
  }
</style>
