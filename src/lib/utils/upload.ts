import fileReaderStream from "filereader-stream";
import { v4 as uuidv4 } from "uuid";

import { chainInfo } from "$lib/utils/chain";

const APP_NAME = "IronDrive";

export const uploadFile = async (
  file: any,
  bundlr: any,
  balance: any,
  contract: any,
  chainId: string,
  onFinishUpload: Function,
  onStatusChange: Function
) => {
  const price = await bundlr.getPrice(file.size);

  if (file.size < 100000 || price.toNumber() < balance.toNumber()) {
    if (
      file.size < 100000 ||
      confirm(
        `It will cost ${bundlr.utils.unitConverter(price).toFixed(10)} ${
          chainInfo(chainId).symbol
        } to upload that file. Do you want to continue?`
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
      const id = uuidv4();

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
              txId: res.data.id,
              id,
            };

            await contract.writeInteraction({
              function: "createFile",
              file: newFile,
            });

            onFinishUpload(id, newFile);

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
