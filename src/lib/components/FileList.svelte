<script lang="ts">
  import Icon from "@iconify/svelte";

  import IconButton from "$lib/components/IconButton.svelte";

  import { formatFilename, formatBytes } from "$lib/utils/format";

  export let files: any;
  export let onDeleteFile: Function;

  const ARWEAVE_GATEWAY_URL = import.meta.env.VITE_ARWEAVE_GATEWAY_URL;
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
            rel="noreferrer"
            title={file.name}>{formatFilename(file.name)}</a
          >
        </span>
        <span class="type">{file.type}</span>
        <span class="size">{formatBytes(file.size)}</span>
        <span class="action">
          <IconButton
            icon="material-symbols:delete-outline"
            onClick={() => {
              onDeleteFile(file.id);
            }}
          />
        </span>
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
    justify-content: space-between;
    line-height: 2.5rem;
    align-items: center;
    padding: 0 1.25rem;
    transition: all 0.2s ease-in-out;
  }
  li:hover {
    background-color: #f9f8f8;
  }
  li span {
    color: #999;
    padding-right: 2rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .name {
    display: flex;
    color: #000;
    font-size: 1.25rem;
    align-items: center;
    column-gap: 0.25rem;
    width: 60%;
  }
  .name a {
    font-size: 1rem;
    max-width: calc(100% - 1.5rem);
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .type {
    width: 20%;
  }
  .size {
    width: 15%;
  }
  .action {
    width: 5%;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding: 0;
  }
</style>
