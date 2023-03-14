<script lang="ts">
  import Icon from "@iconify/svelte";

  export let onClick: any;
  export let disabled: boolean = false;
  export let icon: string | null = null;
</script>

<button on:click={onClick} {disabled}>
  {#if icon}
    <span class="icon">
      <Icon {icon} />
    </span>
  {/if}
  <span class="label">
    <slot />
  </span>
</button>

<style>
  button {
    font-size: 14px;
    font-weight: 500;
    padding: 0 13px;
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
    display: flex;
    align-items: center;
  }
  button:hover {
    color: #666;
  }
  button:disabled {
    pointer-events: none;
    opacity: 0.5;
  }
  .icon {
    width: 24px;
    height: 24px;
    font-size: 1.5em;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .label {
    padding: 13px 0;
    flex: 1;
  }
</style>
