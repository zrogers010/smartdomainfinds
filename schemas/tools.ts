import { z } from "zod";

import { CHAIN_IDS } from "@/lib/tools/chains";

const ChainIdSchema = z
  .string()
  .trim()
  .refine((v) => (CHAIN_IDS as string[]).includes(v), "Unsupported chain.");

/** POST /api/whois input. */
export const WhoisRequestSchema = z.object({
  domain: z.string().trim().min(3).max(253),
});
export type WhoisRequestInput = z.infer<typeof WhoisRequestSchema>;

/** POST /api/bulk-check input. */
export const BulkCheckRequestSchema = z.object({
  domains: z.array(z.string().trim().min(1)).min(1).max(50),
});
export type BulkCheckRequestInput = z.infer<typeof BulkCheckRequestSchema>;

/** POST /api/username input. */
export const UsernameRequestSchema = z.object({
  username: z
    .string()
    .trim()
    .min(1, "Enter a username.")
    .max(39, "Usernames are at most 39 characters."),
});
export type UsernameRequestInput = z.infer<typeof UsernameRequestSchema>;

/** POST /api/ens input. */
export const EnsRequestSchema = z.object({
  name: z.string().trim().min(1, "Enter a name.").max(80),
});
export type EnsRequestInput = z.infer<typeof EnsRequestSchema>;

/** POST /api/tx input — transaction hash + chain. */
export const TxRequestSchema = z.object({
  hash: z.string().trim().min(1, "Enter a transaction hash."),
  chain: ChainIdSchema,
});
export type TxRequestInput = z.infer<typeof TxRequestSchema>;

/** POST /api/wallet input — address or ENS name + chain. */
export const WalletRequestSchema = z.object({
  address: z.string().trim().min(1, "Enter an address or ENS name.").max(120),
  chain: ChainIdSchema,
});
export type WalletRequestInput = z.infer<typeof WalletRequestSchema>;

/** POST /api/nft input — contract + token id + chain. */
export const NftRequestSchema = z.object({
  contract: z.string().trim().min(1, "Enter a contract address."),
  tokenId: z
    .string()
    .trim()
    .min(1, "Enter a token ID.")
    .max(80)
    .regex(/^[0-9]+$/, "Token ID must be a number."),
  chain: ChainIdSchema,
});
export type NftRequestInput = z.infer<typeof NftRequestSchema>;
