/**
 * Minimal OpenAI-compatible chat client built on fetch (no SDK dependency).
 * Works against the OpenAI API or any compatible endpoint via OPENAI_BASE_URL.
 *
 * When no API key is configured, {@link isAiConfigured} returns false and
 * callers fall back to seeded demo data so the app still works end-to-end.
 */

const DEFAULT_BASE_URL = "https://api.openai.com/v1";
const DEFAULT_MODEL = "gpt-5.5";

export function isAiConfigured(): boolean {
  return Boolean(process.env.OPENAI_API_KEY);
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
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not configured.");
  }

  const baseUrl = (process.env.OPENAI_BASE_URL || DEFAULT_BASE_URL).replace(
    /\/$/,
    ""
  );
  const model = process.env.OPENAI_MODEL || DEFAULT_MODEL;

  const res = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      temperature,
      messages,
      ...(jsonMode ? { response_format: { type: "json_object" } } : {}),
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
