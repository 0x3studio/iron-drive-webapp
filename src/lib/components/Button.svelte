<script lang="ts">
  export let onClick: any;
  export let disabled: boolean = false;
</script>

<button on:click={onClick} {disabled}>
  <slot />
</button>

<style>
  button {
    font-size: 16px;
    font-weight: 200;
    letter-spacing: 1px;
    padding: 13px 20px 13px;
    outline: 0;
    border: 1px solid black;
    cursor: pointer;
    position: relative;
    background-color: rgba(0, 0, 0, 0);
    user-select: none;
    -webkit-user-select: none;
    touch-action: manipulation;
  }

  button:after {
    content: "";
    background-color: #ffe54c;
    width: 100%;
    z-index: -1;
    position: absolute;
    height: 100%;
    top: 7px;
    left: 7px;
    transition: 0.2s;
  }

  button:hover:after {
    top: 0px;
    left: 0px;
  }
  button:disabled {
    pointer-events: none;
    border: 1px solid #aaa;
  }

  button:disabled:after {
    background-color: #f9f8f8;
  }
</style>
