<script lang="ts">
  import { balance, bundlrStore, chainId } from "$lib/stores";
  import { uploadFile } from "$lib/utils/upload";

  export let contract: any;
  export let onFinishUpload: Function;

  let dragging: boolean = false;
  let uploadStatus: string = "not_started";

  const onStatusChange = (status: string) => {
    uploadStatus = status;
  };
</script>

<div
  class="dropzone"
  on:dragenter|preventDefault={(e) => {
    dragging = true;
  }}
  on:dragover|preventDefault={(e) => {
    dragging = true;
  }}
  on:drop|preventDefault={(e) => {
    dragging = false;
    const dt = e.dataTransfer;
    const files = dt?.files;
    if (files) {
      const file = files[0];
      uploadFile(
        file,
        $bundlrStore,
        contract,
        $chainId,
        onFinishUpload,
        onStatusChange
      );
    }
  }}
>
  <div
    class:hidden={uploadStatus === "not_started"}
    class="dropzone"
    class:dragging={dragging || uploadStatus !== "not_started"}
    on:dragleave|preventDefault={(e) => {
      dragging = false;
    }}
  >
    {#if uploadStatus === "not_started"}
      <p>Drop a file here...</p>
    {:else if uploadStatus === "working"}
      <p>Uploading...</p>
    {:else if uploadStatus === "done"}
      <p>Uploaded!</p>
    {/if}
  </div>
  <slot />
</div>

<style>
  .dropzone {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: rgba(255, 255, 255, 1);
    backdrop-filter: blur(10px);
    z-index: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .dropzone.dragging {
    opacity: 1;
    border: 3px dashed var(--color-secondary);
    z-index: 1;
    background: rgba(255, 255, 255, 0.5);
  }

  .dropzone.dragging * {
    pointer-events: none;
  }

  .hidden {
    opacity: 0;
    z-index: -1;
  }

  .dropzone p {
    line-height: 1.4em;
    font-size: 16px;
  }
</style>
