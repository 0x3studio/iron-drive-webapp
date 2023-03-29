<script context="module" lang="ts">
  let onTop: HTMLElement;
  const modals: Record<string, { open: Function; close: Function }> = {};

  // 	returns an object for the modal specified by `id`, which contains the API functions (`open` and `close` )
  export function getModal(id = "") {
    return modals[id];
  }
</script>

<script lang="ts">
  import { onDestroy } from "svelte";
  import { fade, fly } from "svelte/transition";
  import { cubicInOut } from "svelte/easing";
  let topDiv: HTMLElement;
  let visible = false;
  let prevOnTop: HTMLElement;
  let closeCallback: Function;

  export let id = "";

  function keyPress(ev: KeyboardEvent) {
    //only respond if the current modal is the top one
    if (ev.key == "Escape" && onTop == topDiv) close(); //ESC
  }

  /**  API **/
  function open(callback: Function) {
    closeCallback = callback;
    if (visible) return;
    prevOnTop = onTop;
    onTop = topDiv;
    window.addEventListener("keydown", keyPress);

    //this prevents scrolling of the main window on larger screens
    document.body.style.overflow = "hidden";

    visible = true;
    console.log("TOPDIV", topDiv);
    //Move the modal in the DOM to be the last child of <BODY> so that it can be on top of everything
    if (topDiv) {
      document.body.appendChild(topDiv);
    }
  }

  function close(retVal?: any) {
    if (!visible) return;
    window.removeEventListener("keydown", keyPress);
    onTop = prevOnTop;
    if (onTop == null) document.body.style.overflow = "";
    visible = false;
    if (closeCallback) closeCallback(retVal);
  }

  //expose the API
  modals[id] = { open, close };

  onDestroy(() => {
    delete modals[id];
    window.removeEventListener("keydown", keyPress);
  });
</script>

{#if visible}
  <div
    id="topModal"
    class:visible
    bind:this={topDiv}
    on:click={() => close()}
    on:keydown={() => {}}
    transition:fade={{ duration: 150, easing: cubicInOut }}
  >
    <div
      id="modal"
      on:click|stopPropagation={() => {}}
      on:keydown={() => {}}
      transition:fly={{ y: 40, duration: 350, easing: cubicInOut }}
    >
      <div id="modal-content">
        <slot />
      </div>
    </div>
  </div>
{/if}

<style>
  #topModal {
    visibility: hidden;
    z-index: 9999;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: #4448;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  #modal {
    min-width: 200px;
    min-height: 200px;
    display: flex;
    flex-direction: column;
    line-height: 1.25rem;
    padding: 1rem;
    background: #f9f8f8;
    border-radius: 10px;
    box-shadow: 0px 4px 9px -4px rgba(0, 0, 0, 0.25);
  }

  .visible {
    visibility: visible !important;
  }

  #modal-content {
    max-width: calc(100vw - 20px);
    max-height: calc(100vh - 20px);
    overflow: auto;
  }
</style>
