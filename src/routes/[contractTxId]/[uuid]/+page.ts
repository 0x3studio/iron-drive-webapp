export async function load(request: any) {
  const params = request.params;

  return {
    contractTxId: params.contractTxId,
    uuid: params.uuid,
  };
}
