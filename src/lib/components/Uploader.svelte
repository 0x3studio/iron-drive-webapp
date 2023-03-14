<script lang="ts">
  import fileReaderStream from "filereader-stream";
  import { utils } from "ethers";

  import IconButton from "$lib/components/IconButton.svelte";

  export let bundlr: any;
  export let balance: any;
  export let contract: any;
  export let onFinishUpload: Function;

  const APP_NAME = "IronMiniDrive";

  let fileInput: any;
  let uploadStatus: string = "not_started";

  const uploadFile = async (e: Event) => {
    const target = e.target as HTMLInputElement;
    if (target.files) {
      const file = target.files[0];

      const price = await bundlr.getPrice(file.size);

      if (file.size < 100000 || price.toNumber() < balance.toNumber()) {
        if (
          file.size < 100000 ||
          confirm(
            `It will cost ${utils.formatEther(
              price.toString()
            )} ETH to upload that file. Do you want to continue?`
          )
        ) {
          uploadStatus = "working";

          const uploader = bundlr.uploader.chunkedUploader;
          uploader.setBatchSize(2);
          uploader.setChunkSize(2_000_000);

          // uploader.on("chunkUpload", (e: any) => {
          //   console.log("uploading", e);
          // });

          const fileStream = fileReaderStream(file);

          uploader
            .uploadData(fileStream, {
              tags: [
                { name: "Content-Type", value: file.type },
                { name: "App-Name", value: APP_NAME },
              ],
            })
            .then(async (res: any) => {
              if (contract) {
                const newFile = {
                  size: file.size,
                  type: file.type,
                  name: file.name,
                  uploadedAt: Date.now(),
                  id: res.data.id,
                };

                await contract.writeInteraction({
                  function: "createFile",
                  file: newFile,
                });

                onFinishUpload(res.data.id, newFile);

                balance = await bundlr.getLoadedBalance();

                uploadStatus = "done";
                setTimeout(() => {
                  uploadStatus = "not_started";
                }, 1000);
              } else {
                uploadStatus = "not_started";
                alert("No contract!");
              }
            })
            .catch((err: any) => {
              console.error(err);
              uploadStatus = "not_started";
              alert("An error occurred!");
            });
        }
      } else {
        alert("Sorry, you do not have enough funds to upload that file!");
      }
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
    <input type="file" on:change={uploadFile} bind:this={fileInput} />
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
    color: #04cae5;
    height: 20px;
  }
</style>
