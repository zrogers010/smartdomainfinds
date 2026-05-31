/**
 * Registry of supported EVM chains for the crypto tools (tx checker, wallet /
 * stablecoin checker, NFT lookup). Every endpoint here is a public, key-free
 * JSON-RPC node, tried in order with fallback — matching the approach used by
 * the ENS checker. Set <CHAIN>_RPC_URL (e.g. ETH_RPC_URL) to prepend your own
 * endpoint (Alchemy/Infura/etc.) as the primary for higher rate limits.
 */

export type Stablecoin = {
  symbol: string;
  address: string;
  decimals: number;
};

export type Chain = {
  /** URL/select slug, e.g. "ethereum". */
  id: string;
  /** Display name, e.g. "Ethereum". */
  name: string;
  /** Short label for compact UI, e.g. "ETH". */
  shortName: string;
  chainId: number;
  /** Native currency symbol, e.g. "ETH", "MATIC", "BNB". */
  nativeSymbol: string;
  /** Env var that, when set, is used as the primary RPC. */
  rpcEnvVar: string;
  /** Public RPC endpoints, tried in order. */
  defaultRpcs: string[];
  /** Block explorer base, no trailing slash. */
  explorer: string;
  /** Major stablecoins on this chain. Decimals vary per chain (BSC uses 18). */
  stablecoins: Stablecoin[];
};

export const CHAINS: Chain[] = [
  {
    id: "ethereum",
    name: "Ethereum",
    shortName: "ETH",
    chainId: 1,
    nativeSymbol: "ETH",
    rpcEnvVar: "ETH_RPC_URL",
    defaultRpcs: [
      "https://ethereum-rpc.publicnode.com",
      "https://eth.drpc.org",
      "https://1rpc.io/eth",
    ],
    explorer: "https://etherscan.io",
    stablecoins: [
      { symbol: "USDC", address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", decimals: 6 },
      { symbol: "USDT", address: "0xdAC17F958D2ee523a2206206994597C13D831ec7", decimals: 6 },
      { symbol: "DAI", address: "0x6B175474E89094C44Da98b954EedeAC495271d0F", decimals: 18 },
    ],
  },
  {
    id: "base",
    name: "Base",
    shortName: "Base",
    chainId: 8453,
    nativeSymbol: "ETH",
    rpcEnvVar: "BASE_RPC_URL",
    defaultRpcs: [
      "https://base-rpc.publicnode.com",
      "https://mainnet.base.org",
      "https://base.drpc.org",
    ],
    explorer: "https://basescan.org",
    stablecoins: [
      { symbol: "USDC", address: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913", decimals: 6 },
      { symbol: "DAI", address: "0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb", decimals: 18 },
    ],
  },
  {
    id: "arbitrum",
    name: "Arbitrum",
    shortName: "ARB",
    chainId: 42161,
    nativeSymbol: "ETH",
    rpcEnvVar: "ARBITRUM_RPC_URL",
    defaultRpcs: [
      "https://arbitrum-one-rpc.publicnode.com",
      "https://arb1.arbitrum.io/rpc",
      "https://arbitrum.drpc.org",
    ],
    explorer: "https://arbiscan.io",
    stablecoins: [
      { symbol: "USDC", address: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831", decimals: 6 },
      { symbol: "USDT", address: "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9", decimals: 6 },
      { symbol: "DAI", address: "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1", decimals: 18 },
    ],
  },
  {
    id: "optimism",
    name: "Optimism",
    shortName: "OP",
    chainId: 10,
    nativeSymbol: "ETH",
    rpcEnvVar: "OPTIMISM_RPC_URL",
    defaultRpcs: [
      "https://optimism-rpc.publicnode.com",
      "https://mainnet.optimism.io",
      "https://optimism.drpc.org",
    ],
    explorer: "https://optimistic.etherscan.io",
    stablecoins: [
      { symbol: "USDC", address: "0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85", decimals: 6 },
      { symbol: "USDT", address: "0x94b008aA00579c1307B0EF2c499aD98a8ce58e58", decimals: 6 },
      { symbol: "DAI", address: "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1", decimals: 18 },
    ],
  },
  {
    id: "polygon",
    name: "Polygon",
    shortName: "POL",
    chainId: 137,
    nativeSymbol: "POL",
    rpcEnvVar: "POLYGON_RPC_URL",
    defaultRpcs: [
      "https://polygon-bor-rpc.publicnode.com",
      "https://polygon-rpc.com",
      "https://polygon.drpc.org",
    ],
    explorer: "https://polygonscan.com",
    stablecoins: [
      { symbol: "USDC", address: "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359", decimals: 6 },
      { symbol: "USDT", address: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F", decimals: 6 },
      { symbol: "DAI", address: "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063", decimals: 18 },
    ],
  },
  {
    id: "bnb",
    name: "BNB Chain",
    shortName: "BNB",
    chainId: 56,
    nativeSymbol: "BNB",
    rpcEnvVar: "BNB_RPC_URL",
    defaultRpcs: [
      "https://bsc-rpc.publicnode.com",
      "https://bsc-dataseed.binance.org",
      "https://bsc.drpc.org",
    ],
    explorer: "https://bscscan.com",
    // BSC stablecoins are 18-decimal, unlike most chains' 6-decimal USDC/USDT.
    stablecoins: [
      { symbol: "USDT", address: "0x55d398326f99059fF775485246999027B3197955", decimals: 18 },
      { symbol: "USDC", address: "0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d", decimals: 18 },
      { symbol: "DAI", address: "0x1AF3F329e8BE154074D8769D1FFa4eE058B1DBc3", decimals: 18 },
    ],
  },
];

const CHAIN_MAP = new Map(CHAINS.map((c) => [c.id, c]));

export function getChain(id: string): Chain | undefined {
  return CHAIN_MAP.get(id);
}

export const CHAIN_IDS = CHAINS.map((c) => c.id);

/** Ordered RPC list for a chain, with an optional env override prepended. */
export function rpcUrlsFor(chain: Chain): string[] {
  const custom = process.env[chain.rpcEnvVar];
  return custom ? [custom, ...chain.defaultRpcs] : chain.defaultRpcs;
}
