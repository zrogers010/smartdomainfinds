import { keccak256 } from "js-sha3";

import { getChain, rpcUrlsFor, type Chain } from "@/lib/tools/chains";

/**
 * Minimal, dependency-free EVM JSON-RPC helpers shared by the crypto tools.
 * All calls use public RPC endpoints with in-order fallback, mirroring the ENS
 * checker. No web3 client library is pulled in — we hand-encode the handful of
 * calls we need (balanceOf, ownerOf, tokenURI, ENS resolution, etc.).
 */
const RPC_TIMEOUT_MS = 8000;
const ZERO = BigInt(0);
const TEN = BigInt(10);

/** 4-byte function selector (keccak256 of the signature, first 4 bytes). */
export function selector(signature: string): string {
  return keccak256(signature).slice(0, 8);
}

/** Low-level JSON-RPC call with multi-endpoint fallback. Returns null on failure. */
export async function rpc<T = string>(
  chain: Chain,
  method: string,
  params: unknown[]
): Promise<T | null> {
  const body = JSON.stringify({ jsonrpc: "2.0", id: 1, method, params });
  for (const url of rpcUrlsFor(chain)) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), RPC_TIMEOUT_MS);
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
        signal: controller.signal,
      });
      if (!res.ok) continue;
      const json = (await res.json()) as { result?: T; error?: unknown };
      if (json.error || json.result === undefined || json.result === null) continue;
      return json.result;
    } catch {
      continue;
    } finally {
      clearTimeout(timeout);
    }
  }
  return null;
}

/** eth_call to a contract, returning the raw hex result (or null). */
export function ethCall(chain: Chain, to: string, data: string): Promise<string | null> {
  return rpc<string>(chain, "eth_call", [{ to, data }, "latest"]);
}

export function hexToBigInt(hex: string | null | undefined): bigint | null {
  if (!hex || hex === "0x") return null;
  try {
    return BigInt(hex);
  } catch {
    return null;
  }
}

function pad32(hexNo0x: string): string {
  return hexNo0x.toLowerCase().replace(/^0x/, "").padStart(64, "0");
}

/** ABI-encode an address as a 32-byte word. */
export function encodeAddress(address: string): string {
  return pad32(address);
}

/** ABI-encode a uint256 as a 32-byte word. */
export function encodeUint(value: bigint): string {
  return pad32(value.toString(16));
}

/** Decode a single ABI address word, or null for the zero address. */
export function decodeAddress(result: string | null): string | null {
  if (!result) return null;
  const hex = result.replace(/^0x/, "");
  if (hex.length < 64) return null;
  const word = hex.slice(hex.length - 64);
  const addr = "0x" + word.slice(24);
  if (/^0x0{40}$/.test(addr)) return null;
  return addr;
}

function hexToBytes(hex: string): number[] {
  const clean = hex.replace(/^0x/, "");
  const out: number[] = [];
  for (let i = 0; i + 1 < clean.length; i += 2) {
    out.push(parseInt(clean.slice(i, i + 2), 16));
  }
  return out;
}

function bytesToUtf8(bytes: number[]): string {
  try {
    return new TextDecoder().decode(new Uint8Array(bytes)).replace(/\u0000+$/g, "").trim();
  } catch {
    return "";
  }
}

/**
 * Decode an ABI-encoded string return value. Handles both the standard dynamic
 * string encoding ([offset][length][data]) and legacy bytes32 strings (some
 * older tokens like MKR return a fixed bytes32 for name()/symbol()).
 */
export function decodeString(result: string | null): string | null {
  if (!result) return null;
  const hex = result.replace(/^0x/, "");
  if (hex.length === 0 || /^0+$/.test(hex)) return null;

  if (hex.length >= 128) {
    const len = parseInt(hex.slice(64, 128), 16);
    if (Number.isFinite(len) && len > 0 && len < 4096) {
      const dataHex = hex.slice(128, 128 + len * 2);
      const str = bytesToUtf8(hexToBytes(dataHex));
      if (str) return str;
    }
  }
  // Fallback: treat the first word as a bytes32 string.
  const str = bytesToUtf8(hexToBytes(hex.slice(0, 64)));
  return str || null;
}

/** Format an integer token amount with `decimals` into a human string. */
export function formatUnits(value: bigint, decimals: number, maxFractionDigits = 4): string {
  const negative = value < ZERO;
  const abs = negative ? -value : value;
  const base = TEN ** BigInt(decimals);
  const whole = abs / base;
  const frac = abs % base;
  const fracFull = frac.toString().padStart(decimals, "0");
  const fracStr = fracFull.slice(0, maxFractionDigits).replace(/0+$/, "");
  const wholeStr = whole.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return `${negative ? "-" : ""}${wholeStr}${fracStr ? "." + fracStr : ""}`;
}

const ADDRESS_RE = /^0x[0-9a-fA-F]{40}$/;

export function isAddress(value: string): boolean {
  return ADDRESS_RE.test(value.trim());
}

export function isTxHash(value: string): boolean {
  return /^0x[0-9a-fA-F]{64}$/.test(value.trim());
}

/** ENS namehash (EIP-137). Returns a 0x-prefixed 32-byte node. */
export function namehash(name: string): string {
  let node = "00".repeat(32);
  const trimmed = name.trim().toLowerCase().replace(/^\.+|\.+$/g, "");
  if (trimmed) {
    const labels = trimmed.split(".");
    for (let i = labels.length - 1; i >= 0; i--) {
      const labelHash = keccak256(labels[i]);
      node = keccak256(hexToBytes(node + labelHash));
    }
  }
  return "0x" + node;
}

const ENS_REGISTRY = "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e";

/** Resolve an ENS name to its primary address on Ethereum mainnet. */
export async function resolveEnsAddress(name: string): Promise<string | null> {
  const eth = getChain("ethereum");
  if (!eth) return null;
  const node = namehash(name).replace(/^0x/, "");
  const resolver = decodeAddress(
    await ethCall(eth, ENS_REGISTRY, "0x" + selector("resolver(bytes32)") + node)
  );
  if (!resolver) return null;
  return decodeAddress(await ethCall(eth, resolver, "0x" + selector("addr(bytes32)") + node));
}

/** Turn an ipfs:// (or bare CID) URI into an HTTPS gateway URL. */
export function ipfsToHttp(uri: string): string {
  const trimmed = uri.trim();
  if (trimmed.startsWith("ipfs://")) {
    return "https://ipfs.io/ipfs/" + trimmed.slice("ipfs://".length).replace(/^ipfs\//, "");
  }
  if (/^[a-zA-Z0-9]{46,}$/.test(trimmed) && trimmed.startsWith("Qm")) {
    return "https://ipfs.io/ipfs/" + trimmed;
  }
  return trimmed;
}
