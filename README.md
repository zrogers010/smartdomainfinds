# SmartDomainFinds

**Find the smartest available domain for your next idea.**

SmartDomainFinds is an AI-powered domain name generator and research assistant. Instead of just answering _"is this domain available?"_, it answers the harder question: _"what is the best available domain for this idea, why is it good, what are the risks, and what should I buy?"_

Describe a startup, product, app, newsletter, or side project and the app generates a diverse set of brandable names, verifies availability through a provider abstraction, scores each option with a deterministic Smart Score, and helps you filter, compare, shortlist, and export the best ones.

> The app runs fully locally with **no API keys** — it uses a deterministic mock availability provider and a high-quality seeded demo generator so the entire experience is usable and testable out of the box.

---

## Tech stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS v4** + custom shadcn/ui-style component library (Radix primitives)
- **Lucide** icons, **next-themes** dark mode, **sonner** toasts
- **Zustand** (+ `persist`) for the shortlist and recent searches
- **Zod** for request + AI-output validation
- **TanStack Query** for async generation/checking
- **Vitest** for unit tests

---

## Getting started

```bash
# 1. Install dependencies
npm install

# 2. Create your env file (optional — the app works without keys)
cp .env.example .env.local

# 3. Run the dev server
npm run dev
# open http://localhost:3000
```

Other scripts:

```bash
npm run build      # production build
npm start          # run the production build
npm run lint       # eslint
npm test           # run the vitest suite
npm run test:watch # watch mode
```

---

## Environment variables

Copy `.env.example` to `.env.local`. Everything is optional for local development.

| Variable | Default | Purpose |
| --- | --- | --- |
| `OPENAI_API_KEY` | _(empty)_ | Enables real AI generation. **If empty, the app uses seeded demo data.** |
| `OPENAI_MODEL` | `gpt-5.5` | Model used for generation. |
| `OPENAI_BASE_URL` | OpenAI | Point at any OpenAI-compatible endpoint. |
| `DOMAIN_PROVIDER` | `rdap` | `rdap` \| `mock` \| `domainr` \| `namecheap`. `rdap` returns real availability with no API key. |
| `DOMAINR_API_KEY` | _(empty)_ | Enables the Domainr/Fastly Domain Research adapter. |
| `DOMAINR_API_MODE` | `fastly` | `fastly` for current Fastly API tokens; `legacy` for older Domainr `client_id` credentials. |
| `NAMECHEAP_API_USER` / `NAMECHEAP_API_KEY` / `NAMECHEAP_USERNAME` / `NAMECHEAP_CLIENT_IP` | _(empty)_ | For the Namecheap adapter (stubbed). |
| `NEXT_PUBLIC_APP_URL` | `http://localhost:3000` | Used for metadata / shareable URLs. |

---

## Architecture

```
app/
  api/
    generate/route.ts                 POST: idea + prefs -> ranked DomainResult[]
    search/route.ts                   POST: query -> instant availability + variations
    generate-more-like-this/route.ts  POST: seed domain -> similar names
  layout.tsx                          fonts, theme provider, metadata, toaster
  page.tsx                            header + DomainFinder + features + footer
  globals.css                         design tokens (light/dark), aurora gradient

components/
  domain/                             search form, result card, grid, badges,
                                      filters, score breakdown, shortlist drawer,
                                      compare table, example prompts, skeletons
  layout/                             header, footer
  ui/                                 shadcn-style primitives (button, card, ...)
  providers.tsx                       theme + query + tooltip providers

lib/
  ai/
    client.ts                         OpenAI-compatible fetch client
    domain-generation-prompt.ts       system + user prompt builder
    generate-domain-candidates.ts     LLM call + Zod validation + demo fallback
    demo-data.ts                      deterministic seeded generator (no key needed)
  domain/
    types.ts                          DomainResult, statuses, styles, TLDs
    utils.ts                          normalize/extract/dedupe + heuristics
    scoring.ts                        deterministic calculateSmartScore()
    availability.ts                   expand TLDs -> check -> score -> rank
    filtering.ts                      client-side filter + sort
    provider.ts                       DomainAvailabilityProvider + factory
    providers/                        mock (full), domainr + namecheap (stubs)
    ui-constants.ts                   example prompts + style metadata
  store/
    shortlist-store.ts                Zustand + persist + CSV export
    recent-searches-store.ts          Zustand + persist
  hooks/use-hydrated.ts               SSR-safe hydration flag

schemas/
  domain.ts                           Zod schemas for requests + AI output
```

### Data flow

```
idea + preferences
      │
      ▼
/api/generate ──► generateDomainCandidates() ──► LLM (if OPENAI_API_KEY)
      │                                       └─► seeded demo data (fallback)
      │                                            │ (validated with Zod)
      ▼                                            ▼
assembleDomainResults(): expand across TLDs (.com first) ─► dedupe
      │
      ▼
availability provider (mock by default) verifies each domain
      │
      ▼
calculateSmartScore() applies weighted buckets + penalties (deterministic)
      │
      ▼
ranked DomainResult[]  ──►  UI: filter / sort / save / compare / export
```

### Core product rule

**The AI never determines availability.** The model proposes candidate names; a `DomainAvailabilityProvider` verifies each one separately. Statuses are `available`, `taken`, `premium`, `unknown`, `checking`, or `error`. The UI only emphasizes a domain as available after it has actually been checked.

### Scoring

`calculateSmartScore()` combines provider-verified availability with AI quality inputs and then applies code-side penalties, so the final number never relies solely on the model's self-assessment.

| Bucket | Max points |
| --- | --- |
| Availability | 25 |
| Brandability | 15 |
| Memorability | 15 |
| Clarity | 15 |
| Pronunciation | 10 |
| Spelling simplicity | 10 |
| SEO relevance | 5 |
| Premium feel | 5 |

Penalties are applied for hyphens, numbers, awkward spelling, too many syllables, excessive length, trademark/brand-confusion-looking names, spammy keywords, and overly generic names.

---

## Availability providers

- **`rdap` (default, real, no API key):** `lib/domain/providers/rdap-provider.ts` performs live RDAP lookups (the authoritative WHOIS replacement). `.com`/`.net` hit Verisign's RDAP directly; `.ai`/`.app`/`.org`/`.dev` use the rdap.org bootstrap. HTTP 200 → `taken`, 404 → `available`, anything else (timeout, rate limit) → `unknown`. **TLDs without reliable public RDAP (e.g. `.io`, `.co`) intentionally return `unknown`** rather than risk a false "available" — consistent with the rule that we never claim availability we haven't verified. RDAP does not expose pricing, so `rdap` results omit price.
- **`mock`:** `DOMAIN_PROVIDER=mock` returns deterministic results derived from a hash of each domain (stable for offline UI development), including fake premium prices. It does **not** perform real lookups.
- **AI generation:** with no `OPENAI_API_KEY`, `generateDemoNames()` produces high-quality, deterministic candidates from your idea keywords. The UI shows a subtle "demo suggestions" note in this mode.

## Real provider integrations

- `lib/domain/providers/domainr-provider.ts` — Domainr/Fastly Domain Research status adapter. Default mode calls Fastly's current `/domain-management/v1/tools/status` endpoint with a `Fastly-Key` token; `DOMAINR_API_MODE=legacy` supports older Domainr `client_id` credentials.
- `lib/domain/providers/namecheap-provider.ts` — Namecheap `domains.check` adapter (interface implemented, network calls TODO).
- A Cloudflare Registrar adapter has a placeholder in the provider factory.
- In-memory availability cache in `availability.ts` with a `TODO(cache)` for Redis/Upstash.

---

## Testing

```bash
npm test
```

Covers domain scoring, deduplication, the mock provider's determinism, Zod validation + malformed-AI recovery, CSV export formatting, and domain normalization.

---

## Known limitations

- Availability uses **real RDAP** by default for supported gTLDs; `.io`, `.co`, and other RDAP-less TLDs report `unknown`. RDAP can be rate-limited under heavy bursts, in which case results degrade to `unknown` (never a false "available").
- The demo generator is keyword-based and intentionally deterministic; real LLM output is more creative.
- The in-memory cache is per server instance and resets on restart.
- No persistence beyond `localStorage` (shortlist + recent searches).
- No auth, payments, trademark, or social-handle checks yet (by design for the MVP).

---

## Roadmap

**Phase 2 — Real domain availability**
Domainr, Namecheap, and Cloudflare Registrar integrations; better price estimates; affiliate registrar links.

**Phase 3 — Brand intelligence**
Social handle checks, basic trademark-risk scan, similar company/domain detection, search-result snapshots, brand-confusion warnings.

**Phase 4 — Pro features**
Accounts, saved projects, bulk generation + bulk checks, PDF naming reports, expiring-domain watchlists, team/client workspaces.

**Phase 5 — Monetization**
Free / Pro / Agency tiers, registrar affiliate revenue, premium naming reports, domain monitoring alerts.

---

## Next recommended steps

1. Add `OPENAI_API_KEY` to enable real generation and compare output quality with the demo generator.
2. Add a `DOMAINR_API_KEY`, set `DOMAIN_PROVIDER=domainr`, and compare coverage/latency against RDAP.
3. Add a shared cache (Upstash Redis) so availability is consistent across serverless instances.
4. Layer in accounts + saved projects to unlock the Pro roadmap.
