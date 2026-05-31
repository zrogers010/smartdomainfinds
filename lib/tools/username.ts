import type { UsernamePlatform, UsernameResult } from "@/lib/tools/types";

const GITHUB_TIMEOUT_MS = 5000;

/** Strip a leading @ and surrounding whitespace from a handle. */
function normalizeUsername(raw: string): string {
  return raw.trim().replace(/^@+/, "");
}

/**
 * GitHub is the one platform we can check reliably and within ToS via its
 * public API: 404 means the username is free, 200 means it's taken. The big
 * social networks aggressively block automated profile checks and forbid
 * scraping, so for those we return a one-click verification link instead of a
 * guess we can't stand behind.
 */
async function checkGithub(username: string): Promise<UsernamePlatform["status"]> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), GITHUB_TIMEOUT_MS);
  try {
    const res = await fetch(
      `https://api.github.com/users/${encodeURIComponent(username)}`,
      {
        headers: {
          Accept: "application/vnd.github+json",
          "User-Agent": "SmartDomainFinds-UsernameChecker",
        },
        signal: controller.signal,
      }
    );
    if (res.status === 200) return "taken";
    if (res.status === 404) return "available";
    return "error";
  } catch {
    return "error";
  } finally {
    clearTimeout(timeout);
  }
}

type LinkPlatform = { id: string; name: string; url: (u: string) => string };

const LINK_PLATFORMS: LinkPlatform[] = [
  { id: "x", name: "X (Twitter)", url: (u) => `https://x.com/${u}` },
  { id: "instagram", name: "Instagram", url: (u) => `https://instagram.com/${u}` },
  { id: "tiktok", name: "TikTok", url: (u) => `https://www.tiktok.com/@${u}` },
  { id: "youtube", name: "YouTube", url: (u) => `https://www.youtube.com/@${u}` },
  { id: "reddit", name: "Reddit", url: (u) => `https://www.reddit.com/user/${u}` },
  { id: "twitch", name: "Twitch", url: (u) => `https://www.twitch.tv/${u}` },
  { id: "facebook", name: "Facebook", url: (u) => `https://www.facebook.com/${u}` },
];

export async function checkUsernames(raw: string): Promise<UsernameResult> {
  const username = normalizeUsername(raw);

  const githubStatus = await checkGithub(username);

  const platforms: UsernamePlatform[] = [
    {
      id: "github",
      name: "GitHub",
      profileUrl: `https://github.com/${username}`,
      status: githubStatus,
    },
    ...LINK_PLATFORMS.map((p) => ({
      id: p.id,
      name: p.name,
      profileUrl: p.url(username),
      status: "link" as const,
    })),
  ];

  return { username, platforms };
}
