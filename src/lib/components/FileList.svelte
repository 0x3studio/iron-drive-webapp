<script lang="ts">
  import Icon from "@iconify/svelte";
  import { formatDistance } from "date-fns";

  import { formatBytes } from "$lib/utils/format";

  export let files: any[];
  export let selectedFile: any;
  export let onSelectFile: Function;

  function handleMsDown(e: MouseEvent) {
    const t = e.target as HTMLElement;
    if (t.classList.contains("list")) {
      selectedFile = null;
      onSelectFile(null);
    }
  }
</script>

<svelte:window on:mousedown={handleMsDown} />

{#if Object.keys(files).length > 0}
  <table cellpadding="0" cellspacing="0">
    {#each Object.values(files) as file, i}
      {#if file.txId}
        <tr
          on:click={() => {
            onSelectFile(file);
          }}
          on:keypress={() => {}}
          class:selected={selectedFile && selectedFile.id === file.id}
        >
          <td class="name">
            <span><Icon icon="ic:outline-insert-drive-file" /></span>
            <span>{file.name}</span>
          </td>
          <td class="date"
            >{formatDistance(file.uploadedAt, new Date(), {
              addSuffix: true,
            })}</td
          >
          <td class="type">{file.type}</td>
          <td class="size">{formatBytes(file.size)}</td>
        </tr>
      {/if}
    {/each}
  </table>
{:else}
  <p>No files uploaded yet. Drag and drop one here!</p>
{/if}

<style>
  table {
    width: 100%;
  }
  tr {
    transition: all 0.75s cubic-bezier(0.075, 0.82, 0.165, 1);
  }
  tr:hover,
  tr.selected {
    background: var(--color-primary);
  }
  td:first-child {
    border-radius: 5px 0 0 5px;
  }
  td:last-child {
    border-radius: 0 5px 5px 0;
  }

  td {
    font-size: 14px;
    line-height: 1em;
    color: var(--color-text-secondary);
    max-width: 0;
    padding: 10px;
    cursor: pointer;
  }
  .name {
    color: #000;
    width: 55%;
  }
  .name span {
    float: left;
  }
  .name span:first-child {
    width: 22px;
  }
  .name span:last-child {
    width: calc(100% - 22px);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .date,
  .type,
  .size {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-weight: 300;
  }
  .date {
    width: 20%;
  }
  .type {
    width: 15%;
  }
  .size {
    width: 10%;
  }
  tr.selected .name {
    font-weight: 500;
  }
  p {
    padding: 5px 10px;
    font-size: 14px;
    color: var(--color-text-secondary);
  }
</style>
