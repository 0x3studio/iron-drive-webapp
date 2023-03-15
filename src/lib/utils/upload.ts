import fileReaderStream from "filereader-stream";
import { utils } from "ethers";

const APP_NAME = "IronMiniDrive";

export const uploadFile = async (
  file: any,
  bundlr: any,
  balance: any,
  contract: any,
  onFinishUpload: Function,
  onStatusChange: Function
) => {
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
      onStatusChange("working");

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

            onStatusChange("done");
            setTimeout(() => {
              onStatusChange("not_started");
            }, 1000);
          } else {
            onStatusChange("not_started");
            alert("No contract!");
          }
        })
        .catch((err: any) => {
          console.error(err);
          onStatusChange("not_started");
          alert("An error occurred!");
        });
    }
  } else {
    alert("Sorry, you do not have enough funds to upload that file!");
  }
};
