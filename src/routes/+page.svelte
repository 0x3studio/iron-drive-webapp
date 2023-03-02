<script lang="ts">
  import { WebBundlr } from "@bundlr-network/client";
  import { providers } from "ethers";
  import { onMount } from "svelte";
  import { WarpFactory } from "warp-contracts";
  import { evmSignature } from "warp-contracts-plugin-signature";

  import { browser } from "$app/environment";

  import Account from "$lib/components/Account.svelte";
  import Balance from "$lib/components/Balance.svelte";
  import Button from "$lib/components/Button.svelte";
  import FileList from "$lib/components/FileList.svelte";
  import Uploader from "$lib/components/Uploader.svelte";

  import { getContract } from "$lib/utils/contract";
  import { ownsToken } from "$lib/utils/token";

  // const MAIN_CONTRACT_SOURCE_TX_ID =
  //   "O-PVoMglLhU0I0X_eICIEWT4_YYFLP062Kg3WNT0yxs";
  const INDIVIDUAL_CONTRACT_SOURCE_TX_ID =
    "n7uP8YWizv7zBYLNrOl8tGckZg-Aaj_3Ek1x-7Pyok4";

  const ARWEAVE_GATEWAY_URL = import.meta.env.VITE_ARWEAVE_GATEWAY_URL;
  const BUNDLR_NODE_URL = import.meta.env.VITE_BUNDLR_NODE_URL;
  const MAIN_CONTRACT_WARP_TX_ID = import.meta.env
    .VITE_MAIN_CONTRACT_WARP_TX_ID;
  const TOKEN_GATING_ENABLED = import.meta.env.VITE_TOKEN_GATING_ENABLED;

  const TOKEN_GATING_CONTRACT_ADDRESS =
    "0x8EFC99918af856699b53DB659533396822f52941";
  const TOKEN_GATING_PROJECT_NAME = "JellyBots";
  const TOKEN_GATING_PROJECT_URL = "https://jellybots.rocks";

  let loadingWallet: boolean = true;
  let loadingContract: boolean = true;

  let chainId: string;
  let accounts: any;
  let canAccessApp: boolean = false;
  let contractTxId: string | null = null;

  let bundlr: any;
  let balance: any;

  let warp: any;
  let wallet: any;

  let owner: any = null;
  let files: any = {};

  const isEnabledTokenGating = () => {
    return TOKEN_GATING_ENABLED === "true";
  };

  const getCanAccessApp = async () => {
    if (accounts.length > 0) {
      return (
        !isEnabledTokenGating() ||
        (await ownsToken(accounts[0], TOKEN_GATING_CONTRACT_ADDRESS))
      );
    }
    return false;
  };

  const getContractTxId = async () => {
    if (accounts.length > 0) {
      const mainContract = getMainContract();
      const { cachedValue } = await mainContract.readState();
      const key = Object.keys(cachedValue.state.users).find(
        (key) => key.toLowerCase() === accounts[0].toLowerCase()
      );
      if (key) {
        return cachedValue.state.users[key];
      }
    }

    return null;
  };

  const loadContract = async () => {
    const contract = getContract(warp, contractTxId, wallet);

    if (contract) {
      const { cachedValue } = await contract.readState();
      owner = cachedValue.state.owner;
      files = cachedValue.state.files;
    }

    loadingContract = false;
  };

  const init = async () => {
    if (window.ethereum) {
      chainId = await window.ethereum.request({ method: "eth_chainId" });
      accounts = await window.ethereum.request({ method: "eth_accounts" });

      window.ethereum.on("chainChanged", (_chainId: string) => {
        chainId = _chainId;
      });

      window.ethereum.on("accountsChanged", async (_accounts: any) => {
        loadingWallet = true;

        accounts = _accounts;

        canAccessApp = await getCanAccessApp();
        contractTxId = await getContractTxId();

        loadingWallet = false;

        loadContract();
      });

      const _warp = WarpFactory.forMainnet();
      const _wallet = { signer: evmSignature, signatureType: "ethereum" };

      warp = _warp;
      wallet = _wallet;

      canAccessApp = await getCanAccessApp();
      contractTxId = await getContractTxId();

      loadingWallet = false;

      loadContract();
    }
  };

  const connectWallet = async () => {
    if (window.ethereum) {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      if (accounts.length === 0) {
        alert("No Ethereum accounts found...");
      }
    } else {
      alert("Please install MetaMask to be able to use this application.");
    }
  };

  const connectBundlr = async () => {
    const provider = new providers.Web3Provider(window.ethereum);
    await provider._ready();

    const _bundlr = new WebBundlr(BUNDLR_NODE_URL, "ethereum", provider);
    await _bundlr.ready();

    const _balance = await _bundlr.getLoadedBalance();

    bundlr = _bundlr;
    balance = _balance;
  };

  const getMainContract = () => {
    const contract = warp.contract(MAIN_CONTRACT_WARP_TX_ID).connect(wallet);
    return contract;
  };

  // const deployMainContract = async () => {
  //   const response = await fetch(
  //     `${ARWEAVE_GATEWAY_URL}/${MAIN_CONTRACT_SOURCE_TX_ID}`
  //   );
  //   const source = await response.text();

  //   const { contractTxId: _contractTxId } = await warp.deploy({
  //     wallet,
  //     initState: JSON.stringify({
  //       users: {},
  //       owner: null,
  //       canEvolve: true,
  //     }),
  //     src: source,
  //   });

  //   console.log(_contractTxId);
  // };

  const deployContract = async () => {
    const response = await fetch(
      `${ARWEAVE_GATEWAY_URL}/${INDIVIDUAL_CONTRACT_SOURCE_TX_ID}`
    );
    const source = await response.text();

    const { contractTxId: _contractTxId } = await warp.deploy({
      wallet,
      initState: JSON.stringify({
        files: {},
        owner: null,
        canEvolve: true,
      }),
      src: source,
    });

    const mainContract = getMainContract();

    await mainContract.writeInteraction({
      function: "createUser",
      contractTxId: _contractTxId,
    });

    contractTxId = _contractTxId;
  };

  const initializeContract = async () => {
    const contract = getContract(warp, contractTxId, wallet);
    if (contract) {
      await contract.writeInteraction({
        function: "initialize",
      });
      owner = accounts[0];
    }
  };

  // const deleteContract = async () => {
  //   if (confirm("Are you sure?")) {
  //     const contract = getMainContract();
  //     await contract.writeInteraction({
  //       function: "deleteUser",
  //     });
  //     contractTxId = null;
  //   }
  // };

  const handleDeleteFile = async (id: string) => {
    const contract = getContract(warp, contractTxId, wallet);
    if (contract) {
      await contract.writeInteraction({
        function: "deleteFile",
        file: {
          id,
        },
      });
      files = delete files[id] && files;
    }
  };

  const handleFinishUpload = (id: string, newFile: string) => {
    files[id] = newFile;
  };

  onMount(() => {
    if (browser) {
      init();
    }
  });
</script>

<h1>Iron MiniDrive</h1>

{#if loadingWallet}
  <p>Loading...</p>
{:else if chainId !== "0x1"}
  <p>Please connect to Ethereum Mainnet.</p>
{:else if accounts.length > 0}
  <Account account={accounts[0]} />
  {#if canAccessApp}
    {#if contractTxId}
      <div class="bundlr">
        {#if bundlr}
          <Balance {bundlr} {balance} />
        {:else}
          <Button onClick={connectBundlr}>Connect with Bundlr</Button>
        {/if}
      </div>
      <div class="uploader">
        <Uploader
          {bundlr}
          {balance}
          contract={getContract(warp, contractTxId, wallet)}
          onFinishUpload={handleFinishUpload}
        />
      </div>
      {#if loadingContract}
        <p>Loading...</p>
      {:else if owner}
        <FileList {files} onDeleteFile={handleDeleteFile} />
      {:else}
        <Button onClick={initializeContract}>Initialize contract</Button>
      {/if}
      <!-- <p><Button onClick={deleteContract}>Delete contract</Button></p> -->
      <!-- <p>
          <Button onClick={deployMainContract}>Deploy main contract</Button>
        </p> -->
    {:else}
      <Button onClick={deployContract}>Deploy contract</Button>
    {/if}
  {:else}
    <p>
      You must own at least one {TOKEN_GATING_PROJECT_NAME} NFT to access this application.
    </p>
    <p>
      <a href={TOKEN_GATING_PROJECT_URL} target="_blank" rel="noreferrer"
        >Get one here</a
      > and refresh this page when it is done.
    </p>
  {/if}
{:else}
  <Button onClick={connectWallet}>Sign in with MetaMask</Button>
{/if}

<style>
  h1 {
    border-bottom: 5px solid #000;
    padding-bottom: 20px;
    margin-bottom: 20px;
  }
  .bundlr {
    border-bottom: 5px solid #000;
    padding-bottom: 20px;
    margin-bottom: 20px;
  }
  .uploader {
    margin-bottom: 20px;
  }
</style>
