export const formatFilename = (str: string) => {
  if (str.length <= 20) {
    return str;
  }
  const index = str.lastIndexOf(".");
  if (index === -1) {
    return str.slice(0, 10) + "..." + str.slice(-10);
  } else {
    const value = str.substring(0, index);
    const extension = str.substring(index + 1);

    return value.slice(0, 10) + "..." + value.slice(-10) + "." + extension;
  }
};

export const formatBytes = (bytes: number, decimals = 2) => {
  if (!+bytes) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};
