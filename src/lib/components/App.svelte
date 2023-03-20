<script lang="ts">
  import { providers } from "ethers";
  import { WebBundlr } from "@bundlr-network/client";
  import { WarpFactory } from "warp-contracts";
  import {
    DeployPlugin,
    InjectedEthereumSigner,
  } from "warp-contracts-plugin-deploy";
  import { evmSignature } from "warp-contracts-plugin-signature";
  import { Jumper } from "svelte-loading-spinners";

  import Button from "$lib/components/Button.svelte";
  // import Dropzone from "$lib/components/Dropzone.svelte";
  import FileDetails from "$lib/components/FileDetails.svelte";
  import FileList from "$lib/components/FileList.svelte";
  import TokenGate from "$lib/components/TokenGate.svelte";
  import Uploader from "$lib/components/Uploader.svelte";

  import SimpleLayout from "$lib/layouts/Simple.svelte";
  import MainLayout from "$lib/layouts/Main.svelte";

  import { chainInfo } from "$lib/utils/chain";
  import { ownsToken } from "$lib/utils/token";

  // const MAIN_CONTRACT_SOURCE_TX_ID =
  //   "0HMxzcYa2Y9HHK_e3wWFdnY0v8Hm_02MH_m0c3pDZBo";
  const INDIVIDUAL_CONTRACT_SOURCE_TX_ID =
    "-IWEnJNOA_xlaXV_cr-71kkq5XDgdIBfH2xqOffxOlY";

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

  let chainId: string;
  let accounts: any = [];
  let canAccessApp: boolean = false;
  let contractTxId: string | null = null;

  let bundlr: any;
  let balance: any;

  let warp: any;

  let owner: any = null;
  let files: any = {};
  let selectedFile: any = null;

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
      // const result = (
      //   await mainContract.getStorageValues([accounts[0].toLowerCase(), "xyz"])
      // ).cachedValue;
      // const value = result.get(accounts[0].toLowerCase());
      // if (value) {
      //   return value;
      // }
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
    const contract = getContract();

    if (contract) {
      const { cachedValue } = await contract.readState();
      owner = cachedValue.state.owner;
      files = cachedValue.state.files;
    }
  };

  const init = async () => {
    if (window.ethereum) {
      chainId = await window.ethereum.request({ method: "eth_chainId" });
      accounts = await window.ethereum.request({ method: "eth_accounts" });

      window.ethereum.on("chainChanged", async (_chainId: string) => {
        chainId = _chainId;
        bundlr = null;
      });

      window.ethereum.on("accountsChanged", async (_accounts: any) => {
        loadingWallet = true;

        accounts = _accounts;

        canAccessApp = await getCanAccessApp();
        contractTxId = await getContractTxId();

        loadingWallet = false;

        loadContract();
      });

      warp = WarpFactory.forMainnet().use(new DeployPlugin());

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

    const _bundlr = new WebBundlr(
      BUNDLR_NODE_URL,
      chainInfo(chainId).name,
      provider
    );
    await _bundlr.ready();

    const _balance = await _bundlr.getLoadedBalance();

    bundlr = _bundlr;
    balance = _balance;
  };

  const getMainContract = () => {
    const contract = warp
      .contract(MAIN_CONTRACT_WARP_TX_ID)
      .connect({ signatureType: "ethereum", signer: evmSignature });
    return contract;
  };

  const getContract = () => {
    if (!contractTxId) {
      return null;
    }
    const contract = warp
      .contract(contractTxId)
      .connect({ signatureType: "ethereum", signer: evmSignature });
    return contract;
  };

  // const deployMainContract = async () => {
  //   const response = await fetch(
  //     `${ARWEAVE_GATEWAY_URL}/${MAIN_CONTRACT_SOURCE_TX_ID}`
  //   );
  //   const source = await response.text();

  //   const provider = new providers.Web3Provider(window.ethereum);
  //   const userSigner = new InjectedEthereumSigner(provider);
  //   await userSigner.setPublicKey();

  //   const { contractTxId: _contractTxId } = await warp.deploy({
  //     wallet: userSigner,
  //     initState: JSON.stringify({
  //       owner: null,
  //       canEvolve: true,
  //     }),
  //     src: source,
  //     evaluationManifest: {
  //       evaluationOptions: {
  //         useKVStorage: true,
  //       },
  //     },
  //   });

  //   console.log(_contractTxId);
  // };

  const deployContract = async () => {
    const response = await fetch(
      `${ARWEAVE_GATEWAY_URL}/${INDIVIDUAL_CONTRACT_SOURCE_TX_ID}`
    );
    const source = await response.text();

    const provider = new providers.Web3Provider(window.ethereum);
    const userSigner = new InjectedEthereumSigner(provider);
    await userSigner.setPublicKey();

    const { contractTxId: _contractTxId } = await warp.deploy({
      wallet: userSigner,
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

  // const initializeMainContract = async () => {
  //   const contract = getMainContract();
  //   if (contract) {
  //     await contract.writeInteraction({
  //       function: "initialize",
  //     });
  //     owner = accounts[0];
  //   }
  // };

  const initializeContract = async () => {
    const contract = getContract();
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

  const handleSelectFile = async (file: any) => {
    selectedFile = file;
  };

  const handleDeleteFile = async (id: string) => {
    const contract = getContract();
    if (contract) {
      await contract.writeInteraction({
        function: "deleteFile",
        file: {
          id,
        },
      });
      files = delete files[id] && files;
      selectedFile = null;
    }
  };

  const handleFinishUpload = (id: string, newFile: string) => {
    files[id] = newFile;
  };

  init();
</script>

<svelte:head>
  <title>Iron Drive by 0x3 Studio</title>
</svelte:head>

{#if loadingWallet}
  <SimpleLayout>
    <Jumper size="44" color="#04cae5" unit="px" duration="1s" />
  </SimpleLayout>
{:else if chainId !== "0x1" && chainId !== "0x89"}
  <SimpleLayout>
    <div class="simple">
      <div class="info">Please connect to Ethereum or Polygon Mainnet.</div>
    </div>
  </SimpleLayout>
{:else if accounts.length === 0}
  <SimpleLayout>
    <div class="action">
      <Button onClick={connectWallet} icon="logos:metamask-icon"
        >Sign in with MetaMask</Button
      >
    </div>
  </SimpleLayout>
{:else if canAccessApp}
  {#if bundlr}
    {#if contractTxId}
      {#if owner}
        <MainLayout account={accounts[0]} {bundlr} {balance} {chainId}>
          <div class="main">
            <!-- <Dropzone
              {bundlr}
              {balance}
              {chainId}
              contract={getContract()}
              onFinishUpload={handleFinishUpload}
            /> -->
            <div class="list">
              <div class="title">
                <h2>My public folder</h2>
                <Uploader
                  {bundlr}
                  {balance}
                  {chainId}
                  contract={getContract()}
                  onFinishUpload={handleFinishUpload}
                />
              </div>
              <div class="files">
                <FileList
                  {files}
                  onSelectFile={handleSelectFile}
                  {selectedFile}
                />
              </div>
            </div>
            {#if selectedFile}
              <div class="details">
                <FileDetails
                  {selectedFile}
                  {contractTxId}
                  onDeleteFile={handleDeleteFile}
                />
              </div>
            {/if}
          </div>
        </MainLayout>
      {:else}
        <SimpleLayout>
          <div class="simple">
            <div class="info">
              Now that the contract is deployed, you need to initialize it to
              make it your own. When it’s done, only you will be able to
              interact with your contract, forever.
            </div>
            <div class="action">
              <Button icon="mdi:user-check" onClick={initializeContract}
                >Initialize contract</Button
              >
            </div>
          </div>
        </SimpleLayout>
      {/if}
    {:else}
      <SimpleLayout>
        <div class="simple">
          <div class="info">
            Iron works in a decentralized way, in order for every user to be the
            sole owner of the content uploaded to the service. To make that
            possible, every user needs to deploy their own contract.
          </div>
          <div class="action">
            <Button
              icon="material-symbols:rocket-launch-outline"
              onClick={deployContract}>Deploy contract</Button
            >
          </div>
        </div>
      </SimpleLayout>
    {/if}
  {:else}
    <SimpleLayout>
      <div class="simple">
        <div class="action">
          <Button onClick={connectBundlr} icon="material-symbols:login"
            >Connect to Bundlr</Button
          >
        </div>
      </div>
    </SimpleLayout>
  {/if}
{:else}
  <SimpleLayout>
    <TokenGate
      name={TOKEN_GATING_PROJECT_NAME}
      url={TOKEN_GATING_PROJECT_URL}
    />
  </SimpleLayout>
{/if}

<style>
  .main {
    display: flex;
    height: 100%;
    position: relative;
  }
  .list {
    flex: 1;
    padding: 20px;
    height: 100%;
    overflow: auto;
  }
  .details {
    width: 400px;
    border-left: 1px solid #f9f8f8;
    height: 100%;
    overflow: auto;
  }
  .files {
    flex: 1;
  }
  .simple {
    display: flex;
    flex-direction: column;
    align-items: center;
    row-gap: 1rem;
  }
  .info {
    font-size: 14px;
    line-height: 1.4em;
    max-width: 400px;
  }
  .action {
    width: 250px;
  }
  .title {
    padding: 10px;
    border-bottom: 1px solid #f9f8f8;
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  h2 {
    font-weight: 500;
    font-size: 16px;
    font-family: "Noto Serif", serif;
  }
</style>
