<script lang="ts">
  import Icon from "@iconify/svelte";

  import IconButton from "$lib/components/IconButton.svelte";

  export let files: any;
  export let onDeleteFile: Function;

  const ARWEAVE_GATEWAY_URL = import.meta.env.VITE_ARWEAVE_GATEWAY_URL;

  const formatBytes = (bytes: number, decimals = 2) => {
    if (!+bytes) return "0 Bytes";

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
  };
</script>

{#if Object.keys(files).length > 0}
  <ul>
    {#each Object.values(files) as file, i}
      <li>
        <span class="name">
          <Icon icon="ic:outline-insert-drive-file" />
          <a
            href="{ARWEAVE_GATEWAY_URL}/{file.id}"
            target="_blank"
            rel="noreferrer">{file.name}</a
          >
        </span>
        <span>{file.type}</span>
        <span>{formatBytes(file.size)}</span>
        <IconButton
          icon="material-symbols:delete-outline"
          onClick={() => {
            onDeleteFile(file.id);
          }}
        />
      </li>
    {/each}
  </ul>
{:else}
  <p>No files uploaded yet.</p>
{/if}

<style>
  ul {
    list-style: none;
    margin: 0 -1.25rem;
  }
  li {
    display: flex;
    column-gap: 3rem;
    justify-content: space-between;
    line-height: 2.5rem;
    align-items: center;
    padding: 0 1.25rem;
    transition: all 0.2s ease-in-out;
  }
  li:hover {
    background-color: #f7f7f7;
  }
  li a {
    color: black;
  }
  li a:hover {
    color: #666;
  }
  li span {
    color: #999;
  }
  .name {
    flex: 1;
    display: flex;
    color: #000;
    font-size: 1.25rem;
    align-items: center;
    column-gap: 0.25rem;
  }
  .name a {
    font-size: 1rem;
  }
</style>
