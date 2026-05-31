import { keccak256 } from "js-sha3";

import type { EnsResult } from "@/lib/tools/types";

/**
 * ENS (.eth) availability via a direct, authoritative on-chain call — no API
 * key required. We ask the ENS BaseRegistrar's `available(uint256)` method,
 * where the token id is the keccak256 labelhash of the name. Ethereum uses
 * keccak256 (not FIPS SHA3-256), so we compute it with js-sha3.
 */
const BASE_REGISTRAR = "0x57f1887a8bf19b14fc0df6fd9b2acc9af147ea85";

// Reliable, key-free public Ethereum JSON-RPC endpoints, tried in order. Set
// ETH_RPC_URL to use your own (e.g. Alchemy/Infura) as the primary.
const DEFAULT_RPCS = [
  "https://ethereum-rpc.publicnode.com",
  "https://eth.drpc.org",
  "https://1rpc.io/eth",
];
const RPC_TIMEOUT_MS = 7000;

// 4-byte selector of available(uint256), computed from the signature.
const AVAILABLE_SELECTOR = keccak256("available(uint256)").slice(0, 8);

function rpcUrls(): string[] {
  const custom = process.env.ETH_RPC_URL;
  return custom ? [custom, ...DEFAULT_RPCS] : DEFAULT_RPCS;
}

/** Normalize a user-entered ENS name into a bare label (no .eth). */
function normalizeLabel(raw: string): string {
  return raw
    .trim()
    .toLowerCase()
    .replace(/\.eth$/i, "")
    .replace(/^\.+|\.+$/g, "");
}

function validateLabel(label: string): string | null {
  if (!label) return "Enter a name to check.";
  if (label.includes(".")) {
    return "Enter a single .eth name without dots (subdomains aren't checked).";
  }
  if (!/^[a-z0-9-]+$/.test(label)) {
    return "Use only letters, numbers, and hyphens for an on-chain check.";
  }
  if (label.length < 3) {
    return "ENS names must be at least 3 characters.";
  }
  return null;
}

/** Compute the uint256 labelhash (keccak256 of the label) as a 32-byte hex string. */
function labelhash(label: string): string {
  return keccak256(label);
}

async function callRpc(rpc: string, data: string): Promise<boolean | null> {
  const body = {
    jsonrpc: "2.0",
    id: 1,
    method: "eth_call",
    params: [{ to: BASE_REGISTRAR, data }, "latest"],
  };

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), RPC_TIMEOUT_MS);
  try {
    const res = await fetch(rpc, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    if (!res.ok) return null;
    const json = (await res.json()) as { result?: string; error?: unknown };
    if (!json.result) return null;
    // ABI-encoded bool: 0x000..001 = true (available), 0x000..000 = false.
    // Strip the 0x and leading zeros; "1" means available, "" (all zeros) false.
    return json.result.replace(/^0x/, "").replace(/^0+/, "") === "1";
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

async function isAvailableOnChain(label: string): Promise<boolean | null> {
  const data = `0x${AVAILABLE_SELECTOR}${labelhash(label)}`;
  // Try endpoints in order; fall back on transient failures/timeouts.
  for (const rpc of rpcUrls()) {
    const result = await callRpc(rpc, data);
    if (result !== null) return result;
  }
  return null;
}

export async function checkEns(raw: string): Promise<EnsResult> {
  const label = normalizeLabel(raw);
  const name = `${label}.eth`;
  const ensAppUrl = `https://app.ens.domains/${encodeURIComponent(name)}`;
  const openseaUrl = `https://opensea.io/assets/ethereum/0x57f1887a8bf19b14fc0df6fd9b2acc9af147ea85/${
    label ? BigInt(`0x${labelhash(label)}`).toString() : ""
  }`;

  const reason = validateLabel(label);
  if (reason) {
    return { name, label, valid: false, reason, available: null, ensAppUrl, openseaUrl };
  }

  const available = await isAvailableOnChain(label);
  return { name, label, valid: true, available, ensAppUrl, openseaUrl };
}
