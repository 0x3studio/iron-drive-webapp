<script lang="ts">
  import Icon from "@iconify/svelte";
  import { formatDistance } from "date-fns";

  import { formatBytes } from "$lib/utils/format";

  export let files: any;
  export let selectedFile: any;
  export let onSelectFile: Function;
</script>

{#if Object.keys(files).length > 0}
  <table cellpadding="0" cellspacing="0">
    {#each Object.values(files) as file, i}
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
    {/each}
  </table>
{:else}
  <p>No files uploaded yet.</p>
{/if}

<style>
  table {
    width: 100%;
  }
  tr {
    transition: all 0.2s ease-in-out;
  }
  tr:hover,
  tr.selected {
    background: #fff6a3;
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
    color: #999;
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
    color: #999;
  }
</style>
