# Iron MiniDrive

A very simple decentralized drive attached to your Ethereum address.
## Install

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2F0x3studio%2Firon-minidrive-webapp&env=VITE_ARWEAVE_GATEWAY_URL,VITE_BUNDLR_NODE_URL,VITE_TOKEN_GATING_ENABLED,VITE_TOKEN_GATING_CONTRACT_ADDRESS,VITE_TOKEN_GATING_PROJECT_NAME,VITE_TOKEN_GATING_PROJECT_URL&envDescription=Information%20needed%20for%20the%20application%20to%20run.)

You'll be asked 3 different things:

* `VITE_ARWEAVE_GATEWAY_URL`: the Arweave gateway URL, for example https://arweave.net
* `VITE_BUNDLR_NODE_URL`: the Bundlr node URL, for example https://node2.bundlr.network
* `VITE_TOKEN_GATING_ENABLED`: whether you want to enable token gating for this app (true or false)
* `VITE_TOKEN_GATING_CONTRACT_ADDRESS`: if token gating is enabled, the contract address for the token (must be ERC-721)
* `VITE_TOKEN_GATING_PROJECT_NAME`: if token gating is enabled, the name of the project (for example "JellyBots")
* `VITE_TOKEN_GATING_PROJECT_URL`: if token gating is enabled, the URL of the project (where people can buy the token, for example https://jellybots.rocks)