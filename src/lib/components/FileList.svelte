<script lang="ts">
  import Icon from "@iconify/svelte";
  import format from "date-fns/format";

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
        <span class="date">{format(file.uploadedAt, "PPpp")}</span>
        <span class="type">{file.type}</span>
        <span class="size">{formatBytes(file.size)}</span>
        <span class="action">
          <IconButton
            icon="material-symbols:delete-outline"
            onClick={() => {
              if (confirm("Are you sure you want to delete this file?")) {
                onDeleteFile(file.id);
              }
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
  }
  li {
    display: flex;
    justify-content: space-between;
    padding: 10px;
    align-items: center;
    transition: all 0.2s ease-in-out;
    font-size: 14px;
    border-radius: 5px;
  }
  li:hover {
    background: #fff6a3;
  }
  li span {
    color: #999;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .name {
    display: flex;
    color: #000;
    align-items: center;
    column-gap: 0.25rem;
    width: 40%;
  }
  .name a {
    font-size: 14px;
    max-width: calc(100% - 1.5rem);
    overflow: hidden;
    text-overflow: ellipsis;
    text-decoration: none;
  }
  .date {
    width: 18%;
  }
  .type {
    width: 18%;
  }
  .size {
    width: 18%;
  }
  .action {
    color: #000;
    width: 6%;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding: 0;
  }
  p {
    padding: 5px 10px;
    font-size: 14px;
    color: #999;
  }
</style>
