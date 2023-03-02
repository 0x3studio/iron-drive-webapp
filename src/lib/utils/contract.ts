export const getContract = (
  warp: any,
  contractTxId: string | null,
  wallet: any
) => {
  if (!contractTxId) {
    return null;
  }
  const contract = warp.contract(contractTxId).connect(wallet);
  return contract;
};
