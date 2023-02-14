import {
  createClient,
  configureChains,
  mainnet,
  readContract,
  erc721ABI,
} from "@wagmi/core";
import { publicProvider } from "@wagmi/core/providers/public";

export const ownsToken = async (
  accountAddress: `0x${string}`,
  contractAddress: `0x${string}`
) => {
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
    address: contractAddress,
    abi: erc721ABI,
    functionName: "balanceOf",
    args: [accountAddress],
  });

  return data.toNumber() > 0;
};
