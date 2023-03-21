<script lang="ts">
  export let contractTxId: string;
  export let uuid: string;

  const API_URL = import.meta.env.VITE_API_URL;
  const ARWEAVE_GATEWAY_URL = import.meta.env.VITE_ARWEAVE_GATEWAY_URL;

  const init = async () => {
    const response = await fetch(`${API_URL}/${contractTxId}`);
    const json = await response.json();

    const file = json.find((item: any) => item.id === uuid);

    if (file) {
      const url = `${ARWEAVE_GATEWAY_URL}/${file.txId}`;
      window.location.href = url;
    } else {
      window.location.href = "/";
    }
  };

  init();
</script>
