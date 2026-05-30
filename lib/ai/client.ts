/**
 * Minimal OpenAI-compatible chat client built on fetch (no SDK dependency).
 * Works against any OpenAI-compatible endpoint, selected purely via env vars:
 *
 *   OpenAI    OPENAI_API_KEY=sk-...            (default base URL)
 *   Groq      OPENAI_BASE_URL=https://api.groq.com/openai/v1   + key
 *   Together  OPENAI_BASE_URL=https://api.together.xyz/v1      + key
 *   DeepInfra OPENAI_BASE_URL=https://api.deepinfra.com/v1/openai + key
 *   Ollama    OPENAI_BASE_URL=http://localhost:11434/v1        (no key needed)
 *
 * AI is considered "on" when either an API key OR an explicit base URL is set.
 * Otherwise {@link isAiConfigured} returns false and callers fall back to the
 * seeded demo generator so the app still works end-to-end with zero config.
 */

const DEFAULT_BASE_URL = "https://api.openai.com/v1";
const DEFAULT_MODEL = "gpt-5.5";

export function isAiConfigured(): boolean {
  // An explicit base URL (e.g. a local Ollama server) enables AI even without a
  // key; hosted providers are enabled by their key.
  return Boolean(process.env.OPENAI_API_KEY || process.env.OPENAI_BASE_URL);
}

type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

export type ChatCompletionOptions = {
  messages: ChatMessage[];
  temperature?: number;
  /** Request a JSON object response when the model supports it. */
  jsonMode?: boolean;
  signal?: AbortSignal;
};

/**
 * Call the chat completions endpoint and return the raw assistant string.
 * Throws on network/HTTP errors so callers can decide how to recover.
 */
export async function chatCompletion({
  messages,
  temperature = 0.8,
  jsonMode = true,
  signal,
}: ChatCompletionOptions): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;
  const baseUrlRaw = process.env.OPENAI_BASE_URL;
  if (!apiKey && !baseUrlRaw) {
    throw new Error(
      "No AI provider configured (set OPENAI_API_KEY or OPENAI_BASE_URL)."
    );
  }

  const baseUrl = (baseUrlRaw || DEFAULT_BASE_URL).replace(/\/$/, "");
  const model = process.env.OPENAI_MODEL || DEFAULT_MODEL;

  // Some local/open endpoints don't implement response_format; allow opting out.
  const useJsonMode = jsonMode && process.env.OPENAI_JSON_MODE !== "false";

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  // Keyless local servers (e.g. Ollama) need no Authorization header.
  if (apiKey) {
    headers.Authorization = `Bearer ${apiKey}`;
  }

  const res = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      model,
      temperature,
      messages,
      ...(useJsonMode ? { response_format: { type: "json_object" } } : {}),
    }),
    signal,
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(
      `AI request failed (${res.status} ${res.statusText}): ${detail.slice(
        0,
        300
      )}`
    );
  }

  const data = (await res.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };

  const content = data.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error("AI response did not include any content.");
  }
  return content;
}
