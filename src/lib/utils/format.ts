export const formatFilename = (str: string, len: number = 30) => {
  if (str.length <= len) {
    return str;
  }
  const index = str.lastIndexOf(".");
  if (index === -1) {
    return str.slice(0, len / 2) + "..." + str.slice(-len / 2);
  } else {
    const value = str.substring(0, index);
    const extension = str.substring(index + 1);

    return (
      value.slice(0, len / 2) + "..." + value.slice(-len / 2) + "." + extension
    );
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
