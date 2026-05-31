import { z } from "zod";

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
