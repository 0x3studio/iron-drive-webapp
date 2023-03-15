<script lang="ts">
  import Icon from "@iconify/svelte";
  import { formatDistance } from "date-fns";

  import Button from "$lib/components/Button.svelte";

  import { formatBytes, formatFilename } from "$lib/utils/format";

  export let selectedFile: any;
  export let onDeleteFile: Function;

  let copied: boolean = false;

  const ARWEAVE_GATEWAY_URL = import.meta.env.VITE_ARWEAVE_GATEWAY_URL;

  const forceDownload = (url: string, name: string) => {
    fetch(url)
      .then((resp) => resp.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.style.display = "none";
        a.href = url;
        // the filename you want
        a.download = name;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      })
      .catch(() => alert("An error occurred while downloading your file."));
  };

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text);
  };
</script>

<div class="container">
  <div class="overview">
    {#if selectedFile.type.startsWith("image/")}
      <img
        src="{ARWEAVE_GATEWAY_URL}/{selectedFile.id}"
        alt={selectedFile.name}
      />
    {:else}
      <div class="icon"><Icon icon="ic:outline-insert-drive-file" /></div>
    {/if}
  </div>
  <h2>{selectedFile.name}</h2>
  <div class="info">
    <div>
      Uploaded {formatDistance(selectedFile.uploadedAt, new Date(), {
        addSuffix: true,
      })}
    </div>
    <div>{selectedFile.type}</div>
    <div>{formatBytes(selectedFile.size)}</div>
    <div class="external">
      <a
        href="{ARWEAVE_GATEWAY_URL}/{selectedFile.id}"
        target="_blank"
        rel="noreferrer"
        title={selectedFile.name}
        download={selectedFile.name}
      >
        <span>{formatFilename(selectedFile.id)}</span>
        <Icon icon="mingcute:external-link-line" />
      </a>
    </div>
  </div>
  <div class="actions">
    <Button
      onClick={() => {
        copyToClipboard(`${ARWEAVE_GATEWAY_URL}/${selectedFile.id}`);
        copied = true;
        setTimeout(() => {
          copied = false;
        }, 1000);
      }}
      icon="material-symbols:ios-share"
      >{copied ? "Copied!" : "Public link"}</Button
    >
    <Button
      onClick={() => {
        if (confirm("Are you sure you want to delete this file?")) {
          onDeleteFile(selectedFile.id);
        }
      }}
      icon="material-symbols:delete-outline">Delete</Button
    >
    <Button
      onClick={() => {
        forceDownload(
          `${ARWEAVE_GATEWAY_URL}/${selectedFile.id}`,
          selectedFile.name
        );
      }}
      icon="material-symbols:cloud-download-outline">Download</Button
    >
  </div>
</div>

<style>
  .container {
    padding: 60px 30px;
  }
  .overview {
    margin-bottom: 1.5rem;
  }
  .icon {
    font-size: 150px;
    height: 150px;
    margin-left: calc(150px / -6);
  }
  img {
    width: 100%;
  }
  h2 {
    font-size: 14px;
    line-height: 1.4em;
    font-weight: 500;
    word-break: break-all;
    margin-bottom: 0.5rem;
  }
  .info {
    font-size: 14px;
    display: flex;
    flex-direction: column;
    row-gap: 0.5rem;
    color: #999;
    margin-bottom: 1.5rem;
  }
  .info a {
    text-decoration: none;
    color: #04cae5;
    transition: all 0.2s ease-in-out;
  }
  .info a:hover {
    color: #666;
  }

  .info .external a {
    display: flex;
    align-items: center;
    column-gap: 0.25rem;
  }
  .actions {
    display: flex;
    flex-direction: column;
    row-gap: 0.75rem;
  }
</style>
