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
