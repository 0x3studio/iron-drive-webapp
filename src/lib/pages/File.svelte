<script lang="ts">
  import { WarpFactory } from "warp-contracts";
  import { evmSignature } from "warp-contracts-plugin-signature";

  export let contractTxId: string;
  export let uuid: string;

  const ARWEAVE_GATEWAY_URL = import.meta.env.VITE_ARWEAVE_GATEWAY_URL;

  const init = async () => {
    const warp = WarpFactory.forMainnet({ inMemory: true, dbLocation: "2" });

    const contract = warp
      .contract(contractTxId)
      .connect({ type: "ethereum", signer: evmSignature });

    const { cachedValue } = await contract.readState();

    if (cachedValue.state && cachedValue.state.files[uuid]) {
      const txId = cachedValue.state.files[uuid].txId;
      const url = `${ARWEAVE_GATEWAY_URL}/${txId}`;
      window.location.href = url;
    } else {
      window.location.href = "/";
    }
  };

  init();
</script>
