import { getChain } from "@/lib/tools/chains";
import {
  decodeAddress,
  decodeString,
  encodeUint,
  ethCall,
  ipfsToHttp,
  isAddress,
  selector,
} from "@/lib/tools/evm";
import type { NftAttribute, NftResult } from "@/lib/tools/types";

const NAME = selector("name()");
const SYMBOL = selector("symbol()");
const OWNER_OF = selector("ownerOf(uint256)");
const TOKEN_URI = selector("tokenURI(uint256)");
const URI_1155 = selector("uri(uint256)");

const METADATA_TIMEOUT_MS = 8000;

// OpenSea chain slugs differ from ours; only map the ones OpenSea supports.
const OPENSEA_SLUGS: Record<string, string> = {
  ethereum: "ethereum",
  base: "base",
  arbitrum: "arbitrum",
  optimism: "optimism",
  polygon: "matic",
};

type RawMetadata = {
  name?: unknown;
  description?: unknown;
  image?: unknown;
  image_url?: unknown;
  attributes?: unknown;
};

function parseAttributes(input: unknown): NftAttribute[] {
  if (!Array.isArray(input)) return [];
  const out: NftAttribute[] = [];
  for (const item of input) {
    if (item && typeof item === "object") {
      const obj = item as Record<string, unknown>;
      const trait = obj.trait_type ?? obj.traitType ?? obj.trait;
      const value = obj.value;
      if (value !== undefined && value !== null && value !== "") {
        out.push({ trait: trait ? String(trait) : "Trait", value: String(value) });
      }
    }
    if (out.length >= 20) break;
  }
  return out;
}

async function fetchMetadata(uri: string): Promise<RawMetadata | null> {
  // On-chain metadata encoded directly in the token URI.
  if (uri.startsWith("data:")) {
    try {
      const comma = uri.indexOf(",");
      if (comma === -1) return null;
      const meta = uri.slice(0, comma);
      const payload = uri.slice(comma + 1);
      const json = meta.includes("base64")
        ? Buffer.from(payload, "base64").toString("utf8")
        : decodeURIComponent(payload);
      return JSON.parse(json) as RawMetadata;
    } catch {
      return null;
    }
  }

  const url = ipfsToHttp(uri);
  if (!/^https?:\/\//i.test(url)) return null;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), METADATA_TIMEOUT_MS);
  try {
    const res = await fetch(url, { signal: controller.signal });
    if (!res.ok) return null;
    return (await res.json()) as RawMetadata;
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

export async function lookupNft(
  rawContract: string,
  rawTokenId: string,
  chainId: string
): Promise<NftResult | { error: string }> {
  const chain = getChain(chainId)!;
  const contract = rawContract.trim().toLowerCase();
  if (!isAddress(contract)) return { error: "Enter a valid 0x contract address." };

  let tokenId: bigint;
  try {
    tokenId = BigInt(rawTokenId.trim());
  } catch {
    return { error: "Token ID must be a whole number." };
  }

  const idParam = encodeUint(tokenId);
  const openseaSlug = OPENSEA_SLUGS[chain.id];

  const [nameRaw, symbolRaw, ownerRaw, tokenUriRaw] = await Promise.all([
    ethCall(chain, contract, "0x" + NAME),
    ethCall(chain, contract, "0x" + SYMBOL),
    ethCall(chain, contract, "0x" + OWNER_OF + idParam),
    ethCall(chain, contract, "0x" + TOKEN_URI + idParam),
  ]);

  const collectionName = decodeString(nameRaw);
  const symbol = decodeString(symbolRaw);
  const owner = decodeAddress(ownerRaw);

  let standard: NftResult["tokenStandard"] = owner ? "ERC-721" : null;
  let uri = decodeString(tokenUriRaw);
  if (!uri) {
    const uri1155 = decodeString(await ethCall(chain, contract, "0x" + URI_1155 + idParam));
    if (uri1155) {
      uri = uri1155;
      standard = "ERC-1155";
    }
  }

  if (!uri && !collectionName && !owner) {
    return {
      error: `No NFT found at that contract / token ID on ${chain.name}. Double-check the address, token ID, and chain.`,
    };
  }

  // ERC-1155 URIs may contain an {id} placeholder (lowercase, 64-hex, no 0x).
  if (uri && uri.includes("{id}")) {
    uri = uri.replace("{id}", tokenId.toString(16).padStart(64, "0"));
  }

  let metadataName: string | null = null;
  let description: string | null = null;
  let imageUrl: string | null = null;
  let attributes: NftAttribute[] = [];

  if (uri) {
    const meta = await fetchMetadata(uri);
    if (meta) {
      if (typeof meta.name === "string") metadataName = meta.name;
      if (typeof meta.description === "string") description = meta.description;
      const image = meta.image ?? meta.image_url;
      if (typeof image === "string" && image) imageUrl = ipfsToHttp(image);
      attributes = parseAttributes(meta.attributes);
    }
  }

  return {
    chainId: chain.id,
    chainName: chain.name,
    contract,
    tokenId: tokenId.toString(),
    collectionName,
    symbol,
    owner,
    tokenStandard: standard,
    metadataName,
    description,
    imageUrl,
    attributes,
    explorerUrl: `${chain.explorer}/token/${contract}?a=${tokenId.toString()}`,
    openseaUrl: openseaSlug
      ? `https://opensea.io/assets/${openseaSlug}/${contract}/${tokenId.toString()}`
      : null,
  };
}
