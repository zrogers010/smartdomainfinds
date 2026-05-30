#!/usr/bin/env node
/**
 * Dependency-free secret scanner. Blocks commits that contain likely
 * credentials (API keys, private keys, real .env files, etc.).
 *
 * Usage:
 *   node scripts/check-secrets.mjs          # scan staged changes (pre-commit)
 *   node scripts/check-secrets.mjs --all    # scan all tracked files (CI)
 *
 * Wire it as a git hook once with:
 *   git config core.hooksPath .githooks
 */

import { execSync } from "node:child_process";

const scanAll = process.argv.includes("--all");

/** Files we never scan (examples, lockfiles, this scanner, binaries). */
const IGNORE_PATHS = [
  /(^|\/)package-lock\.json$/,
  /(^|\/)pnpm-lock\.yaml$/,
  /(^|\/)yarn\.lock$/,
  /(^|\/)\.env\.example$/,
  /(^|\/)env\.production\.example$/,
  /(^|\/)scripts\/check-secrets\.mjs$/,
  /\.(png|jpe?g|gif|webp|ico|woff2?|ttf|otf|pdf|lock)$/i,
];

/**
 * Patterns for high-confidence secrets. Each has a label for the error output.
 * NEXT_PUBLIC_* and obvious placeholders are filtered out separately.
 */
const PATTERNS = [
  { label: "OpenAI API key", re: /\bsk-[A-Za-z0-9]{20,}\b/ },
  { label: "OpenAI project key", re: /\bsk-proj-[A-Za-z0-9_-]{20,}\b/ },
  { label: "Groq API key", re: /\bgsk_[A-Za-z0-9]{20,}\b/ },
  { label: "AWS access key id", re: /\bAKIA[0-9A-Z]{16}\b/ },
  { label: "Google API key", re: /\bAIza[0-9A-Za-z_-]{35}\b/ },
  { label: "Slack token", re: /\bxox[baprs]-[0-9A-Za-z-]{10,}\b/ },
  { label: "GitHub token", re: /\bgh[pousr]_[A-Za-z0-9]{36,}\b/ },
  { label: "Private key block", re: /-----BEGIN (?:RSA |EC |OPENSSH |PGP )?PRIVATE KEY-----/ },
  {
    label: "Generic secret assignment",
    re: /\b(?:api[_-]?key|secret|password|passwd|token|client[_-]?secret)\b\s*[:=]\s*['"][^'"\s]{12,}['"]/i,
  },
];

/** Lines that are clearly placeholders, not real secrets. */
const PLACEHOLDER = /(example|placeholder|your[-_]|<[^>]+>|xxxx|replace[-_ ]?me|dummy|changeme|sk-\.\.\.|gsk_\.\.\.)/i;

function sh(cmd) {
  return execSync(cmd, { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });
}

function listFiles() {
  const out = scanAll
    ? sh("git ls-files")
    : sh("git diff --cached --name-only --diff-filter=ACM");
  return out
    .split("\n")
    .map((f) => f.trim())
    .filter(Boolean)
    .filter((f) => !IGNORE_PATHS.some((re) => re.test(f)));
}

function readContent(file) {
  try {
    // Staged blob for pre-commit; working tree for --all.
    return scanAll ? sh(`git show HEAD:"${file}" 2>/dev/null || cat "${file}"`) : sh(`git show :"${file}"`);
  } catch {
    return "";
  }
}

const findings = [];
for (const file of listFiles()) {
  const content = readContent(file);
  if (!content || content.includes("\u0000")) continue; // skip binary
  const lines = content.split("\n");
  lines.forEach((line, i) => {
    if (PLACEHOLDER.test(line)) return;
    if (/NEXT_PUBLIC_/.test(line)) return; // public by design (shipped to client)
    for (const { label, re } of PATTERNS) {
      if (re.test(line)) {
        findings.push({ file, line: i + 1, label, text: line.trim().slice(0, 120) });
        break;
      }
    }
  });
}

if (findings.length > 0) {
  console.error("\n\u2717 Potential secret(s) detected — commit blocked:\n");
  for (const f of findings) {
    console.error(`  ${f.file}:${f.line}  [${f.label}]`);
    console.error(`    ${f.text}`);
  }
  console.error(
    "\nMove secrets to an untracked env file (see deploy/env.production.example)." +
      "\nIf this is a false positive, you can bypass with: git commit --no-verify\n"
  );
  process.exit(1);
}

console.log("\u2713 No secrets detected.");
