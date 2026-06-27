import type { DomainResult } from "@/lib/domain/types";
import { getRegistrarSearchUrl } from "@/lib/domain/utils";

export type CuratedAvailability = "availableish" | "registered" | "unknown";

export type CuratedDomainScore = {
  marketPull: number;
  buyerClarity: number;
  brandability: number;
  commercialIntent: number;
  readability: number;
  extensionFit: number;
};

export type CuratedDomainFind = {
  domain: string;
  category: string;
  tone: "brandable" | "literal" | "technical" | "premium";
  score: number;
  scores: CuratedDomainScore;
  summary: string;
  buyerType: string;
  useCases: string[];
  availability: CuratedAvailability;
  checkedAt: string;
  dropSlug: string;
};

export type DomainDrop = {
  title: string;
  slug: string;
  description: string;
  publishedAt: string;
  domains: CuratedDomainFind[];
};

const checkedAt = "2026-06-26T23:50:00.000Z";

export const DOMAIN_DROPS: DomainDrop[] = [
  {
    title: "Drop 001: Agent Ops / AI Governance",
    slug: "agent-ops-ai-governance",
    description:
      "Names for the control layer around AI agents, model approvals, private deployments, and workflow guardrails.",
    publishedAt: "2026-06-26",
    domains: [
      {
        domain: "workflowwarden.com",
        category: "AI Governance",
        tone: "brandable",
        score: 81,
        scores: {
          marketPull: 9,
          buyerClarity: 8,
          brandability: 8,
          commercialIntent: 8,
          readability: 8,
          extensionFit: 9,
        },
        summary:
          "A clean B2B name for workflow monitoring, automation control, or agentic process governance.",
        buyerType: "AI automation or compliance workflow startup",
        useCases: ["Workflow guardrails", "Agent approvals", "Automation audit trails"],
        availability: "availableish",
        checkedAt,
        dropSlug: "agent-ops-ai-governance",
      },
      {
        domain: "modelpermit.com",
        category: "AI Governance",
        tone: "technical",
        score: 78,
        scores: {
          marketPull: 9,
          buyerClarity: 8,
          brandability: 7,
          commercialIntent: 8,
          readability: 8,
          extensionFit: 9,
        },
        summary:
          "A strong fit for model approval flows, eval gates, regulated AI deployment, or internal policy controls.",
        buyerType: "Enterprise AI governance platform",
        useCases: ["Model approvals", "Eval gates", "Deployment policy"],
        availability: "availableish",
        checkedAt,
        dropSlug: "agent-ops-ai-governance",
      },
      {
        domain: "localmodelops.com",
        category: "Private AI",
        tone: "literal",
        score: 73,
        scores: {
          marketPull: 8,
          buyerClarity: 8,
          brandability: 6,
          commercialIntent: 8,
          readability: 7,
          extensionFit: 9,
        },
        summary:
          "Literal but useful positioning for private, on-device, or self-hosted model operations.",
        buyerType: "Local AI infrastructure or privacy AI product",
        useCases: ["Private inference", "On-device AI", "Self-hosted LLM ops"],
        availability: "availableish",
        checkedAt,
        dropSlug: "agent-ops-ai-governance",
      },
      {
        domain: "shadowagent.io",
        category: "Agent Security",
        tone: "brandable",
        score: 72,
        scores: {
          marketPull: 8,
          buyerClarity: 7,
          brandability: 8,
          commercialIntent: 7,
          readability: 8,
          extensionFit: 7,
        },
        summary:
          "Good security angle for unauthorized agents, shadow automation, or agent inventory.",
        buyerType: "Cybersecurity or AI observability startup",
        useCases: ["Shadow AI detection", "Agent inventory", "Automation monitoring"],
        availability: "availableish",
        checkedAt,
        dropSlug: "agent-ops-ai-governance",
      },
      {
        domain: "workflowpermit.com",
        category: "Workflow Automation",
        tone: "literal",
        score: 68,
        scores: {
          marketPull: 7,
          buyerClarity: 7,
          brandability: 6,
          commercialIntent: 8,
          readability: 7,
          extensionFit: 9,
        },
        summary:
          "A direct name for approval flows, automation release gates, or permissioned workflow execution.",
        buyerType: "Enterprise workflow or compliance tool",
        useCases: ["Approval workflows", "Automation gates", "Policy checks"],
        availability: "availableish",
        checkedAt,
        dropSlug: "agent-ops-ai-governance",
      },
      {
        domain: "codedebt.ai",
        category: "Developer Tools",
        tone: "brandable",
        score: 67,
        scores: {
          marketPull: 8,
          buyerClarity: 7,
          brandability: 7,
          commercialIntent: 7,
          readability: 8,
          extensionFit: 6,
        },
        summary:
          "A concise devtools name for the maintenance burden created by AI-written code.",
        buyerType: "Code review, refactoring, or engineering intelligence product",
        useCases: ["AI code review", "Refactoring assistant", "Technical debt reports"],
        availability: "availableish",
        checkedAt,
        dropSlug: "agent-ops-ai-governance",
      },
    ],
  },
  {
    title: "Drop 002: Agent Gates / Permissions",
    slug: "agent-gates-permissions",
    description:
      "Names for agent permissioning, action review, secure context handling, and tool-use control planes.",
    publishedAt: "2026-06-26",
    domains: [
      {
        domain: "toolgatekeeper.com",
        category: "Agent Permissions",
        tone: "literal",
        score: 80,
        scores: {
          marketPull: 9,
          buyerClarity: 9,
          brandability: 7,
          commercialIntent: 8,
          readability: 7,
          extensionFit: 9,
        },
        summary:
          "Very clear positioning for a permission layer that controls which tools AI agents can use.",
        buyerType: "Agent framework, security layer, or MCP permissions product",
        useCases: ["Tool permissions", "Agent access control", "Human approvals"],
        availability: "availableish",
        checkedAt,
        dropSlug: "agent-gates-permissions",
      },
      {
        domain: "modelgateops.com",
        category: "AI Governance",
        tone: "technical",
        score: 77,
        scores: {
          marketPull: 8,
          buyerClarity: 8,
          brandability: 7,
          commercialIntent: 8,
          readability: 7,
          extensionFit: 9,
        },
        summary:
          "Enterprise AI governance feel for model approvals, eval checkpoints, and release gates.",
        buyerType: "AI governance or platform engineering team",
        useCases: ["Model release gates", "Eval approvals", "Governance dashboards"],
        availability: "availableish",
        checkedAt,
        dropSlug: "agent-gates-permissions",
      },
      {
        domain: "actiongateops.com",
        category: "Agent Permissions",
        tone: "technical",
        score: 75,
        scores: {
          marketPull: 8,
          buyerClarity: 8,
          brandability: 7,
          commercialIntent: 8,
          readability: 7,
          extensionFit: 9,
        },
        summary:
          "A practical name for systems where agents propose actions and humans or policies approve them.",
        buyerType: "Agent ops, workflow automation, or AI safety startup",
        useCases: ["Action approvals", "Agent audit logs", "Workflow permissions"],
        availability: "availableish",
        checkedAt,
        dropSlug: "agent-gates-permissions",
      },
      {
        domain: "modellockbox.com",
        category: "Private AI",
        tone: "premium",
        score: 74,
        scores: {
          marketPull: 8,
          buyerClarity: 7,
          brandability: 8,
          commercialIntent: 8,
          readability: 8,
          extensionFit: 9,
        },
        summary:
          "A memorable name for encrypted model storage, secure fine-tune custody, or model IP protection.",
        buyerType: "Private AI, security, or model custody product",
        useCases: ["Model custody", "Encrypted model storage", "Private fine-tunes"],
        availability: "availableish",
        checkedAt,
        dropSlug: "agent-gates-permissions",
      },
      {
        domain: "contextlockbox.com",
        category: "Private AI",
        tone: "premium",
        score: 73,
        scores: {
          marketPull: 8,
          buyerClarity: 7,
          brandability: 8,
          commercialIntent: 7,
          readability: 8,
          extensionFit: 9,
        },
        summary:
          "Strong privacy positioning for secure context storage, memory vaulting, or enterprise prompt data handling.",
        buyerType: "Agent memory, privacy AI, or secure context platform",
        useCases: ["Context vaulting", "Agent memory privacy", "Prompt data controls"],
        availability: "availableish",
        checkedAt,
        dropSlug: "agent-gates-permissions",
      },
      {
        domain: "promptcheckpoint.com",
        category: "Prompt Security",
        tone: "technical",
        score: 71,
        scores: {
          marketPull: 8,
          buyerClarity: 8,
          brandability: 7,
          commercialIntent: 7,
          readability: 7,
          extensionFit: 9,
        },
        summary:
          "Useful for tools that inspect, approve, or version prompts before execution or release.",
        buyerType: "Prompt security, evals, or AI app testing product",
        useCases: ["Prompt review", "Release checkpoints", "Prompt regression testing"],
        availability: "availableish",
        checkedAt,
        dropSlug: "agent-gates-permissions",
      },
    ],
  },
];

export const CURATED_DOMAINS = DOMAIN_DROPS.flatMap((drop) => drop.domains);

export function curatedTlds(domains = CURATED_DOMAINS): string[] {
  return Array.from(new Set(domains.map((find) => find.domain.split(".").pop() ?? "")))
    .filter(Boolean)
    .sort();
}

export function curatedCategories(domains = CURATED_DOMAINS): string[] {
  return Array.from(new Set(domains.map((find) => find.category))).sort();
}

export function curatedDomainToResult(find: CuratedDomainFind): DomainResult {
  const [baseName, tld] = find.domain.split(".");
  return {
    id: `curated-${find.domain}`,
    baseName,
    domain: find.domain,
    tld,
    style: find.tone === "literal" ? "descriptive" : "brandable",
    availability:
      find.availability === "registered"
        ? "taken"
        : find.availability === "unknown"
          ? "unknown"
          : "available",
    registrarUrl: getRegistrarSearchUrl(find.domain),
    smartScore: find.score,
    scores: {
      availability: find.availability === "registered" ? 0 : 21,
      brandability: Math.round(find.scores.brandability * 1.5),
      clarity: Math.round(find.scores.buyerClarity * 1.5),
      memorability: Math.round(find.scores.readability * 1.5),
      pronunciation: find.scores.readability,
      spelling: find.scores.readability,
      seo: Math.round(find.scores.marketPull / 2),
      premiumFeel: Math.round(find.scores.commercialIntent / 2),
    },
    rationale: find.summary,
    risks: [
      "Automated availability signals should be confirmed at a registrar before purchase.",
      "Run a trademark search before using any domain commercially.",
    ],
    alternatives: [],
  };
}

