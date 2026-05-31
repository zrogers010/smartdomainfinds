import { promises as dns } from "node:dns";

import { extractTld, normalizeDomain } from "@/lib/domain/utils";
import type { WhoisDnsRecords, WhoisResult } from "@/lib/tools/types";

const RDAP_TIMEOUT_MS = 6000;

/**
 * Universal RDAP entry point. rdap.org reads the IANA bootstrap registry and
 * redirects to the authoritative registry RDAP server, giving us broad TLD
 * coverage for single, low-volume WHOIS lookups (unlike the bulk availability
 * path, which hits registries directly to avoid throttling).
 */
function rdapUrl(domain: string): string {
  return `https://rdap.org/domain/${encodeURIComponent(domain)}`;
}

type RdapEvent = { eventAction?: string; eventDate?: string };
type RdapEntity = {
  roles?: string[];
  vcardArray?: unknown;
  publicIds?: { type?: string; identifier?: string }[];
  entities?: RdapEntity[];
};
type RdapResponse = {
  events?: RdapEvent[];
  status?: string[];
  entities?: RdapEntity[];
  nameservers?: { ldhName?: string }[];
};

function eventDate(events: RdapEvent[] | undefined, action: string): string | null {
  const match = events?.find((e) => e.eventAction === action);
  return match?.eventDate ?? null;
}

/** Pull a display name out of an RDAP entity's jCard (vcardArray). */
function vcardName(entity: RdapEntity): string | null {
  const vcard = entity.vcardArray;
  if (!Array.isArray(vcard) || vcard.length < 2) return null;
  const props = vcard[1];
  if (!Array.isArray(props)) return null;
  for (const prop of props) {
    if (Array.isArray(prop) && prop[0] === "fn" && typeof prop[3] === "string") {
      return prop[3];
    }
  }
  return null;
}

function findRegistrar(entities: RdapEntity[] | undefined): string | null {
  if (!entities) return null;
  for (const entity of entities) {
    if (entity.roles?.includes("registrar")) {
      return (
        vcardName(entity) ??
        entity.publicIds?.find((p) => p.identifier)?.identifier ??
        null
      );
    }
    const nested = findRegistrar(entity.entities);
    if (nested) return nested;
  }
  return null;
}

function yearsSince(dateStr: string | null): number | null {
  if (!dateStr) return null;
  const then = new Date(dateStr).getTime();
  if (Number.isNaN(then)) return null;
  const ms = Date.now() - then;
  if (ms < 0) return null;
  return Math.floor(ms / (365.25 * 24 * 60 * 60 * 1000));
}

async function lookupRdap(domain: string): Promise<{
  registered: boolean | null;
  registrar: string | null;
  createdDate: string | null;
  updatedDate: string | null;
  expiryDate: string | null;
  statuses: string[];
  nameservers: string[];
  rdapUnsupported: boolean;
}> {
  const empty = {
    registered: null as boolean | null,
    registrar: null as string | null,
    createdDate: null as string | null,
    updatedDate: null as string | null,
    expiryDate: null as string | null,
    statuses: [] as string[],
    nameservers: [] as string[],
    rdapUnsupported: false,
  };

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), RDAP_TIMEOUT_MS);
  try {
    const res = await fetch(rdapUrl(domain), {
      headers: { Accept: "application/rdap+json" },
      redirect: "follow",
      signal: controller.signal,
    });

    if (res.status === 404) {
      return { ...empty, registered: false };
    }
    if (res.status === 400 || res.status === 422 || res.status === 501) {
      // Bad/unsupported TLD for RDAP.
      return { ...empty, rdapUnsupported: true };
    }
    if (!res.ok) {
      return empty;
    }

    const data = (await res.json()) as RdapResponse;
    return {
      registered: true,
      registrar: findRegistrar(data.entities),
      createdDate: eventDate(data.events, "registration"),
      updatedDate: eventDate(data.events, "last changed"),
      expiryDate: eventDate(data.events, "expiration"),
      statuses: data.status ?? [],
      nameservers: (data.nameservers ?? [])
        .map((n) => n.ldhName?.toLowerCase())
        .filter((n): n is string => Boolean(n)),
      rdapUnsupported: false,
    };
  } catch {
    return empty;
  } finally {
    clearTimeout(timeout);
  }
}

async function safe<T>(p: Promise<T>): Promise<T | null> {
  try {
    return await p;
  } catch {
    return null;
  }
}

async function lookupDns(domain: string): Promise<WhoisDnsRecords> {
  const [a, aaaa, mx, ns, txt, cname] = await Promise.all([
    safe(dns.resolve4(domain)),
    safe(dns.resolve6(domain)),
    safe(dns.resolveMx(domain)),
    safe(dns.resolveNs(domain)),
    safe(dns.resolveTxt(domain)),
    safe(dns.resolveCname(domain)),
  ]);

  return {
    a: a ?? [],
    aaaa: aaaa ?? [],
    mx: (mx ?? [])
      .sort((x, y) => x.priority - y.priority)
      .map((r) => `${r.priority} ${r.exchange}`),
    ns: (ns ?? []).map((n) => n.toLowerCase()).sort(),
    txt: (txt ?? []).map((parts) => parts.join("")),
    cname: cname ?? [],
  };
}

/** Full WHOIS-style lookup: registration data (RDAP) + live DNS records. */
export async function lookupDomainInfo(input: string): Promise<WhoisResult> {
  const domain = normalizeDomain(input);
  const tld = extractTld(domain);

  // A bare label with no dot isn't a domain we can look up.
  if (!tld) {
    return {
      domain,
      registered: null,
      registrar: null,
      createdDate: null,
      updatedDate: null,
      expiryDate: null,
      ageYears: null,
      statuses: [],
      nameservers: [],
      dns: { a: [], aaaa: [], mx: [], ns: [], txt: [], cname: [] },
      rdapUnsupported: true,
    };
  }

  const [rdap, dnsRecords] = await Promise.all([
    lookupRdap(domain),
    lookupDns(domain),
  ]);

  return {
    domain,
    registered: rdap.registered,
    registrar: rdap.registrar,
    createdDate: rdap.createdDate,
    updatedDate: rdap.updatedDate,
    expiryDate: rdap.expiryDate,
    ageYears: yearsSince(rdap.createdDate),
    statuses: rdap.statuses,
    nameservers: rdap.nameservers.length
      ? rdap.nameservers
      : dnsRecords.ns,
    dns: dnsRecords,
    rdapUnsupported: rdap.rdapUnsupported,
  };
}
