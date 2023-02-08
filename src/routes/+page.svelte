<script lang="ts">
  import { WebBundlr } from "@bundlr-network/client";
  import { providers, utils } from "ethers";
  import { onMount } from "svelte";
  import fileReaderStream from "filereader-stream";
  import { WarpFactory } from "warp-contracts";
  import { evmSignature } from "warp-contracts-plugin-signature";
  import {
    createClient,
    configureChains,
    mainnet,
    readContract,
    erc721ABI,
  } from "@wagmi/core";
  import { publicProvider } from "@wagmi/core/providers/public";

  import { browser } from "$app/environment";

  const APP_NAME = "IronMiniDrive";
  const MAIN_CONTRACT_SOURCE_TX_ID =
    "O-PVoMglLhU0I0X_eICIEWT4_YYFLP062Kg3WNT0yxs";
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
  let loadingContract: boolean = false;

  let chainId: string;
  let accounts: any;
  let canAccessApp: boolean = false;
  let contractTxId: string | null = null;

  let bundlr: any;
  let balance: any;

  let uploadStatus: string = "not_started";
  let fundingStatus: string = "not_started";

  let warp: any;
  let wallet: any;

  let owner: any = null;
  let files: any = {};

  const isEnabledTokenGating = () => {
    return TOKEN_GATING_ENABLED === "true";
  };

  const ownsToken = async () => {
    if (accounts.length > 0) {
      const { provider, webSocketProvider } = configureChains(
        [mainnet],
        [publicProvider()]
      );

      createClient({
        autoConnect: true,
        provider,
        webSocketProvider,
      });

      const data = await readContract({
        address: TOKEN_GATING_CONTRACT_ADDRESS,
        abi: erc721ABI,
        functionName: "balanceOf",
        args: [accounts[0]],
      });

      return data.toNumber() > 0;
    }

    return false;
  };

  const getCanAccessApp = async () => {
    return !isEnabledTokenGating() || (await ownsToken());
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

  const init = async () => {
    if (window.ethereum) {
      chainId = await window.ethereum.request({ method: "eth_chainId" });
      accounts = await window.ethereum.request({ method: "eth_accounts" });

      window.ethereum.on("chainChanged", (_chainId: string) => {
        chainId = _chainId;
      });

      window.ethereum.on("accountsChanged", async (_accounts: any) => {
        accounts = _accounts;
        canAccessApp = await getCanAccessApp();
        contractTxId = await getContractTxId();
      });

      const _warp = WarpFactory.forMainnet();
      const _wallet = { signer: evmSignature, signatureType: "ethereum" };

      warp = _warp;
      wallet = _wallet;

      canAccessApp = await getCanAccessApp();
      contractTxId = await getContractTxId();

      loadingWallet = false;
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

    loadingContract = true;

    const contract = getContract();

    if (contract) {
      const { cachedValue } = await contract.readState();
      owner = cachedValue.state.owner;
      files = cachedValue.state.files;
    }

    setTimeout(() => {
      loadingContract = false;
    }, 1000);
  };

  const getMainContract = () => {
    const contract = warp.contract(MAIN_CONTRACT_WARP_TX_ID).connect(wallet);
    return contract;
  };

  const getContract = () => {
    if (!contractTxId) {
      return null;
    }
    const contract = warp.contract(contractTxId).connect(wallet);
    return contract;
  };

  const deployMainContract = async () => {
    const response = await fetch(
      `${ARWEAVE_GATEWAY_URL}/${MAIN_CONTRACT_SOURCE_TX_ID}`
    );
    const source = await response.text();

    const { contractTxId: _contractTxId } = await warp.deploy({
      wallet,
      initState: JSON.stringify({
        users: {},
        owner: null,
        canEvolve: true,
      }),
      src: source,
    });

    console.log(_contractTxId);
  };

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
    const contract = getContract();
    if (contract) {
      await contract.writeInteraction({
        function: "initialize",
      });
      owner = accounts[0];
    }
  };

  const deleteContract = async () => {
    if (confirm("Are you sure?")) {
      const contract = getMainContract();
      await contract.writeInteraction({
        function: "deleteUser",
      });
      contractTxId = null;
    }
  };

  const refreshBalance = async () => {
    balance = await bundlr.getLoadedBalance();
  };

  const fund = async () => {
    fundingStatus = "working";
    try {
      await bundlr.fund(100000000000000); // 0.0001 ETH (TODO: people can choose how much they want to fund)
      balance = await bundlr.getLoadedBalance();
      fundingStatus = "done";
      setTimeout(() => {
        fundingStatus = "not_started";
      }, 1000);
    } catch (err) {
      fundingStatus = "not_started";
    }
  };

  const uploadFile = async (e: Event) => {
    const target = e.target as HTMLInputElement;
    if (target.files) {
      const file = target.files[0];

      const price = await bundlr.getPrice(file.size);

      if (file.size < 100000 || price.toNumber() < balance.toNumber()) {
        if (
          file.size < 100000 ||
          confirm(
            `It will cost ${utils.formatEther(
              price.toString()
            )} ETH to upload that file. Do you want to continue?`
          )
        ) {
          uploadStatus = "working";

          const uploader = bundlr.uploader.chunkedUploader;
          uploader.setBatchSize(2);
          uploader.setChunkSize(2_000_000);

          // uploader.on("chunkUpload", (e: any) => {
          //   console.log("uploading", e);
          // });

          const fileStream = fileReaderStream(file);

          uploader
            .uploadData(fileStream, {
              tags: [
                { name: "Content-Type", value: file.type },
                { name: "App-Name", value: APP_NAME },
              ],
            })
            .then(async (res: any) => {
              const contract = getContract();
              if (contract) {
                const newFile = {
                  size: file.size,
                  type: file.type,
                  name: file.name,
                  uploadedAt: Date.now(),
                  id: res.data.id,
                };

                await contract.writeInteraction({
                  function: "createFile",
                  file: newFile,
                });

                files[res.data.id] = newFile;

                balance = await bundlr.getLoadedBalance();

                uploadStatus = "done";
                setTimeout(() => {
                  uploadStatus = "not_started";
                }, 1000);
              } else {
                uploadStatus = "not_started";
                alert("No contract!");
              }
            })
            .catch((err: any) => {
              console.error(err);
              uploadStatus = "not_started";
              alert("An error occurred!");
            });
        }
      } else {
        alert("Sorry, you do not have enough funds to upload that file!");
      }
    }
  };

  const deleteFile = async (id: any) => {
    const contract = getContract();
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
  <p>
    Connected with account: <strong>{accounts[0]}</strong>
  </p>
  {#if canAccessApp}
    {#if contractTxId}
      {#if bundlr}
        {#if balance}
          <p>
            Your balance: <strong
              >{utils.formatEther(balance.toString())} ETH</strong
            >
            <button on:click={refreshBalance}>Refresh</button>
          </p>
          <p>
            {#if fundingStatus === "not_started"}
              <button on:click={fund}>Fund</button>
            {:else if fundingStatus === "working"}
              You account is being funded. It can take a few minutes to process.
              Don't close the current window until it's done.
            {:else}
              You account has been funded! It can take a few minutes to reflect
              on your balance.
            {/if}
          </p>
        {/if}
        {#if uploadStatus === "not_started"}
          <p><input type="file" on:change={uploadFile} /></p>
        {:else if uploadStatus === "working"}
          <p>Uploading...</p>
        {:else if uploadStatus === "done"}
          <p>Uploaded!</p>
        {/if}
        {#if loadingContract}
          <p>Loading...</p>
        {:else if owner}
          {#if Object.keys(files).length > 0}
            <ul>
              {#each Object.values(files) as file, i}
                <li>
                  <a
                    href="{ARWEAVE_GATEWAY_URL}/{file.id}"
                    target="_blank"
                    rel="noreferrer">{file.name}</a
                  >
                  ({file.type} - {file.size})
                  <button
                    on:click={() => {
                      deleteFile(file.id);
                    }}>Delete</button
                  >
                </li>
              {/each}
            </ul>
          {:else}
            <p>No files uploaded yet.</p>
          {/if}
        {:else}
          <p>
            <button on:click={initializeContract}>Initialize contract</button>
          </p>
        {/if}
        <!-- <p><button on:click={deleteContract}>Delete contract</button></p> -->
        <!-- <p>
          <button on:click={deployMainContract}>Deploy main contract</button>
        </p> -->
      {:else}
        <p><button on:click={connectBundlr}>Connect with Bundlr</button></p>
      {/if}
    {:else}
      <button on:click={deployContract}>Deploy contract</button>
    {/if}
  {:else}
    <p>
      You must own a {TOKEN_GATING_PROJECT_NAME} token to access this application.
    </p>
    <p>
      <a href={TOKEN_GATING_PROJECT_URL} target="_blank" rel="noreferrer"
        >Get one here</a
      >
    </p>
  {/if}
{:else}
  <button on:click={connectWallet}>Sign in with MetaMask</button>
{/if}
