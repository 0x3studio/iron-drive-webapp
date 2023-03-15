<script lang="ts">
  import { uploadFile } from "$lib/utils/upload";

  export let bundlr: any;
  export let balance: any;
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
  class:dragging
  on:dragenter={(e) => {
    e.preventDefault();
    e.stopPropagation();
    dragging = true;
  }}
  on:dragover={(e) => {
    e.preventDefault();
    e.stopPropagation();
    dragging = true;
  }}
  on:dragleave={(e) => {
    e.preventDefault();
    e.stopPropagation();
    dragging = false;
  }}
  on:drop={(e) => {
    e.preventDefault();
    e.stopPropagation();
    dragging = false;

    const dt = e.dataTransfer;
    const files = dt?.files;

    if (files) {
      const file = files[0];
      console.log(file);

      uploadFile(
        file,
        bundlr,
        balance,
        contract,
        onFinishUpload,
        onStatusChange
      );
    }
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

<style>
  .dropzone {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: rgba(255, 255, 255, 0.5);
    backdrop-filter: blur(10px);
    z-index: 100;
    border: 3px dashed #ddd;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .dropzone.dragging {
    border-color: #04cae5;
  }

  .dropzone p {
    line-height: 1.4em;
    font-size: 16px;
  }
</style>
