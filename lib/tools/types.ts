import type { DomainAvailabilityStatus } from "@/lib/domain/types";

/** Result of a WHOIS / RDAP + DNS lookup for a single domain. */
export type WhoisDnsRecords = {
  a: string[];
  aaaa: string[];
  mx: string[];
  ns: string[];
  txt: string[];
  cname: string[];
};

export type WhoisResult = {
  domain: string;
  /** Whether a registration record exists. null = couldn't determine. */
  registered: boolean | null;
  registrar: string | null;
  createdDate: string | null;
  updatedDate: string | null;
  expiryDate: string | null;
  /** Whole-year age derived from the creation date, if known. */
  ageYears: number | null;
  /** EPP status codes (e.g. clientTransferProhibited). */
  statuses: string[];
  nameservers: string[];
  dns: WhoisDnsRecords;
  /** True when the TLD has no public RDAP server, so registration is unknown. */
  rdapUnsupported: boolean;
};

/** Per-platform availability for the username checker. */
export type UsernamePlatform = {
  id: string;
  name: string;
  /** Where a profile lives, for one-click manual verification. */
  profileUrl: string;
  /**
   * "available" / "taken" only when we can verify reliably (e.g. GitHub API).
   * "link" means we provide a one-click check rather than a guess.
   */
  status: "available" | "taken" | "link" | "error";
};

export type UsernameResult = {
  username: string;
  platforms: UsernamePlatform[];
};

/** Result of an ENS (.eth) availability check. */
export type EnsResult = {
  /** Full ENS name, e.g. "vitalik.eth". */
  name: string;
  /** Normalized label (the part before .eth). */
  label: string;
  valid: boolean;
  /** Present when valid === false. */
  reason?: string;
  /** null when on-chain lookup failed. */
  available: boolean | null;
  /** Links for registering / viewing the name. */
  ensAppUrl: string;
  openseaUrl: string;
};

/** One row in the bulk domain availability checker. */
export type BulkCheckRow = {
  domain: string;
  status: DomainAvailabilityStatus;
  registrarUrl: string;
};

export type BulkCheckResult = {
  rows: BulkCheckRow[];
  checkedCount: number;
};

/** Result of a cross-chain transaction lookup. */
export type TxResult = {
  chainId: string;
  chainName: string;
  hash: string;
  /** False when the hash isn't found on the selected chain. */
  found: boolean;
  /** null while pending (no receipt yet) or when found === false. */
  status: "success" | "failed" | "pending" | null;
  from: string | null;
  to: string | null;
  /** Contract creation transactions have no `to` address. */
  contractCreated: string | null;
  /** Native value transferred, formatted (e.g. "1.25"). */
  value: string | null;
  nativeSymbol: string;
  gasUsed: string | null;
  /** Total gas fee in native currency, formatted. */
  fee: string | null;
  blockNumber: number | null;
  confirmations: number | null;
  explorerUrl: string;
};

/** A single token balance row for the wallet checker. */
export type TokenBalance = {
  symbol: string;
  /** Formatted balance (e.g. "1,250.50"). */
  amount: string;
};

/** Result of a wallet / stablecoin balance lookup on one chain. */
export type WalletResult = {
  chainId: string;
  chainName: string;
  /** The 0x address actually queried (resolved from ENS when applicable). */
  address: string;
  /** Original ENS name, when the input resolved from one. */
  ensName: string | null;
  nativeSymbol: string;
  nativeBalance: string;
  stablecoins: TokenBalance[];
  /** Sum of stablecoin balances, treated 1:1 with USD. */
  stablecoinTotal: string;
  explorerUrl: string;
};

/** One NFT metadata trait. */
export type NftAttribute = { trait: string; value: string };

/** Result of an NFT lookup (ERC-721 / ERC-1155). */
export type NftResult = {
  chainId: string;
  chainName: string;
  contract: string;
  tokenId: string;
  collectionName: string | null;
  symbol: string | null;
  /** Current owner (ERC-721). Null for ERC-1155 or when unavailable. */
  owner: string | null;
  tokenStandard: "ERC-721" | "ERC-1155" | null;
  metadataName: string | null;
  description: string | null;
  imageUrl: string | null;
  attributes: NftAttribute[];
  explorerUrl: string;
  openseaUrl: string | null;
};
