import { http, cookieStorage, createConfig, createStorage } from "wagmi";
import { mainnet, sepolia, polygonAmoy, baseSepolia } from "wagmi/chains";
import { connectorsForWallets } from "@rainbow-me/rainbowkit";
import { type Chain } from "viem";

export const aia = {
  id: 1320,
  name: "Aitd Testnet",
  rpcUrls: {
    default: { http: ["https://aia-dataseed1-testnet.aiachain.org"] },
  },
  nativeCurrency: {
    name: "AITD Testnet",
    symbol: "AIA",
    decimals: 18,
  },
  sourceId: 1320,
  testnet: true,

  blockExplorers: {
    default: {
      name: "AITD Chain Explorer Testnet",
      url: "https://block-explorer-testnet.aitd.io",
      apiUrl: "https://block-explorer-testnet.aitd.io",
    },
  },
} as const satisfies Chain;

export function getConfig(connectors: ReturnType<typeof connectorsForWallets>) {
  return createConfig({
    chains: [mainnet, sepolia, polygonAmoy, baseSepolia, aia],
    connectors,
    storage: createStorage({
      storage: cookieStorage,
    }),
    ssr: true,
    transports: {
      [polygonAmoy.id]: http(),
      [mainnet.id]: http(),
      [sepolia.id]: http(),
      [baseSepolia.id]: http(),
      [aia.id]: http(),
    },
  });
}

declare module "wagmi" {
  interface Register {
    config: ReturnType<typeof getConfig>;
  }
}
