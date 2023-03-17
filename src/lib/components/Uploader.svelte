<script lang="ts">
  import IconButton from "$lib/components/IconButton.svelte";

  import { uploadFile } from "$lib/utils/upload";

  export let bundlr: any;
  export let balance: any;
  export let contract: any;
  export let chainId: string;
  export let onFinishUpload: Function;

  let fileInput: any;
  let uploadStatus: string = "not_started";

  const onStatusChange = (status: string) => {
    uploadStatus = status;
  };

  const handleChange = (e: any) => {
    const target = e.target;
    if (target.files) {
      const file = target.files[0];
      uploadFile(
        file,
        bundlr,
        balance,
        contract,
        chainId,
        onFinishUpload,
        onStatusChange
      );
    }
  };
</script>

{#if uploadStatus === "not_started"}
  <div class="action">
    <IconButton
      icon="ic:outline-upload-file"
      onClick={() => {
        if (bundlr) {
          fileInput.click();
        } else {
          alert("Please connect with Bundlr to be able to upload files.");
        }
      }}
    />
    <input type="file" on:change={handleChange} bind:this={fileInput} />
  </div>
{:else if uploadStatus === "working"}
  <p>Uploading...</p>
{:else if uploadStatus === "done"}
  <p>Uploaded!</p>
{/if}

<style>
  input[type="file"] {
    display: none;
  }
  p {
    line-height: 20px;
    font-size: 14px;
  }
  .action {
    height: 20px;
  }
</style>
