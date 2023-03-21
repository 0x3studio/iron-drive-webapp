import { error, redirect } from "@sveltejs/kit";
import { Wallet } from "ethers";
import { WarpFactory } from "warp-contracts";
import {
  buildEvmSignature,
  EvmSignatureVerificationServerPlugin,
} from "warp-contracts-plugin-signature/server";

const ARWEAVE_GATEWAY_URL = import.meta.env.VITE_ARWEAVE_GATEWAY_URL;

export async function load(request: any) {
  const params = request.params;

  const warp = WarpFactory.forMainnet({ inMemory: true, dbLocation: "2" }).use(
    new EvmSignatureVerificationServerPlugin()
  );
  const wallet = Wallet.createRandom();

  const contract = warp
    .contract(params.contractTxId)
    .connect({ type: "ethereum", signer: buildEvmSignature(wallet) });

  const { cachedValue } = await contract.readState();

  if (cachedValue.state && cachedValue.state.files[params.uuid]) {
    const txId = cachedValue.state.files[params.uuid].txId;
    const url = `${ARWEAVE_GATEWAY_URL}/${txId}`;
    throw redirect(302, url);
  } else {
    throw error(404, {
      message: "Not found",
    });
  }
}
