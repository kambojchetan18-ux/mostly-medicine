import Anthropic from "@anthropic-ai/sdk";

// LLM router for Mostly Medicine — moves low-stakes calls onto cheaper
// OpenAI-compatible providers (Groq + DeepSeek) and falls back to Anthropic
// whenever the cheaper provider's key is missing or its API errors. The
// caller never sees a thrown error from a missing/down cheap provider — we
// always retry once on Claude before surfacing the failure.
//
// Adding a new use case:
//   1) Add it to the LlmUseCase union below.
//   2) Add a routing entry inside pickModel().
//   3) Migrate the callsite to runChat().
//
// Adding a new provider:
//   1) Add a literal to the Provider union below.
//   2) Extend pickModel() to return a config for it.
//   3) Extend runChat() to dispatch to it.

export type LlmUseCase =
  | "clinical_scoring"
  | "clinical_explain"
  | "general_chat"
  | "mentor_short"
  | "content_draft"
  | "taste_chat";

export type Provider = "anthropic" | "groq" | "deepseek";

export interface ModelChoice {
  provider: Provider;
  model: string;
  baseURL?: string;
  apiKeyEnv: string;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface RunChatInput {
  useCase: LlmUseCase;
  system: string;
  messages: ChatMessage[];
  maxTokens: number;
  cacheSystem?: boolean;
  // Optional sampling temperature — Anthropic, Groq, and DeepSeek all accept it.
  temperature?: number;
}

export interface RunChatResult {
  text: string;
  model: string;
  provider: Provider;
}

const ANTHROPIC_CLINICAL_MODEL = "claude-haiku-4-5-20251001";
const GROQ_BASE_URL = "https://api.groq.com/openai/v1";
const DEEPSEEK_BASE_URL = "https://api.deepseek.com/v1";

// Anthropic fallback choice — used whenever the chosen cheap provider's
// key is missing or its API call throws.
const ANTHROPIC_FALLBACK: ModelChoice = {
  provider: "anthropic",
  model: ANTHROPIC_CLINICAL_MODEL,
  apiKeyEnv: "ANTHROPIC_API_KEY",
};

export function pickModel(useCase: LlmUseCase): ModelChoice {
  switch (useCase) {
    case "clinical_scoring":
    case "clinical_explain":
      // High-stakes — stay on Claude.
      return ANTHROPIC_FALLBACK;
    case "general_chat":
      // Ask AI inside dashboard — cheap, factual, English.
      return {
        provider: "deepseek",
        model: "deepseek-chat",
        baseURL: DEEPSEEK_BASE_URL,
        apiKeyEnv: "DEEPSEEK_API_KEY",
      };
    case "content_draft":
      // Article / social drafts — DeepSeek is strong on long-form English.
      return {
        provider: "deepseek",
        model: "deepseek-chat",
        baseURL: DEEPSEEK_BASE_URL,
        apiKeyEnv: "DEEPSEEK_API_KEY",
      };
    case "mentor_short":
      // ≤25-word nudges — Llama 3.1 8B on Groq is plenty and ~free.
      return {
        provider: "groq",
        model: "llama-3.1-8b-instant",
        baseURL: GROQ_BASE_URL,
        apiKeyEnv: "GROQ_API_KEY",
      };
    case "taste_chat":
      // Public taste pages — short turns, low stakes.
      return {
        provider: "groq",
        model: "llama-3.1-8b-instant",
        baseURL: GROQ_BASE_URL,
        apiKeyEnv: "GROQ_API_KEY",
      };
    default: {
      // Exhaustiveness check — TS will flag a missing case.
      const _exhaustive: never = useCase;
      void _exhaustive;
      return ANTHROPIC_FALLBACK;
    }
  }
}

let _anthropic: Anthropic | null = null;
function anthropicClient(): Anthropic {
  if (!_anthropic) {
    _anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  }
  return _anthropic;
}

interface OpenAIChatChoice {
  message?: { role?: string; content?: string };
}

interface OpenAIChatResponse {
  choices?: OpenAIChatChoice[];
}

function isOpenAIChatResponse(value: unknown): value is OpenAIChatResponse {
  if (!value || typeof value !== "object") return false;
  const choices = (value as { choices?: unknown }).choices;
  return choices === undefined || Array.isArray(choices);
}

async function callOpenAICompatible(args: {
  baseURL: string;
  apiKey: string;
  model: string;
  system: string;
  messages: ChatMessage[];
  maxTokens: number;
  temperature?: number;
}): Promise<string> {
  const res = await fetch(`${args.baseURL}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${args.apiKey}`,
    },
    body: JSON.stringify({
      model: args.model,
      max_tokens: args.maxTokens,
      temperature: args.temperature,
      messages: [
        { role: "system", content: args.system },
        ...args.messages.map((m) => ({ role: m.role, content: m.content })),
      ],
    }),
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => "<no body>");
    throw new Error(`OpenAI-compatible call failed ${res.status}: ${errText.slice(0, 300)}`);
  }

  const data: unknown = await res.json();
  if (!isOpenAIChatResponse(data)) {
    throw new Error("Unexpected response shape from OpenAI-compatible endpoint");
  }
  const text = data.choices?.[0]?.message?.content;
  if (typeof text !== "string" || text.length === 0) {
    throw new Error("Empty response from OpenAI-compatible endpoint");
  }
  return text;
}

async function callAnthropic(args: {
  model: string;
  system: string;
  messages: ChatMessage[];
  maxTokens: number;
  cacheSystem: boolean;
  temperature?: number;
}): Promise<string> {
  // cache_control is supported at runtime in @anthropic-ai/sdk@0.32.x but
  // missing from the published types — cast workaround per CLAUDE.md note.
  const systemBlocks = args.cacheSystem
    ? ([
        {
          type: "text",
          text: args.system,
          cache_control: { type: "ephemeral" },
        },
      ] as unknown as Anthropic.TextBlockParam[])
    : args.system;

  const response = await anthropicClient().messages.create({
    model: args.model,
    max_tokens: args.maxTokens,
    temperature: args.temperature,
    system: systemBlocks,
    messages: args.messages.map((m) => ({ role: m.role, content: m.content })),
  });

  const text = response.content
    .map((b) => (b.type === "text" ? b.text : ""))
    .join("")
    .trim();
  if (text.length === 0) {
    throw new Error("Empty response from Anthropic");
  }
  return text;
}

export async function runChat(input: RunChatInput): Promise<RunChatResult> {
  const choice = pickModel(input.useCase);
  const cacheSystem = input.cacheSystem ?? true;

  // Path A: chosen provider is already Anthropic — just call it directly.
  if (choice.provider === "anthropic") {
    const text = await callAnthropic({
      model: choice.model,
      system: input.system,
      messages: input.messages,
      maxTokens: input.maxTokens,
      cacheSystem,
      temperature: input.temperature,
    });
    return { text, model: choice.model, provider: "anthropic" };
  }

  // Path B: chosen provider is Groq or DeepSeek. Try the cheap path first,
  // fall back to Anthropic on missing key or any error.
  const apiKey = process.env[choice.apiKeyEnv];
  if (apiKey && choice.baseURL) {
    try {
      const text = await callOpenAICompatible({
        baseURL: choice.baseURL,
        apiKey,
        model: choice.model,
        system: input.system,
        messages: input.messages,
        maxTokens: input.maxTokens,
        temperature: input.temperature,
      });
      return { text, model: choice.model, provider: choice.provider };
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.warn(
        `[llm-router] ${choice.provider} call failed for use case '${input.useCase}', falling back to Anthropic: ${msg}`
      );
      // fall through to Anthropic fallback
    }
  } else {
    console.warn(
      `[llm-router] ${choice.apiKeyEnv} missing — using Anthropic fallback for use case '${input.useCase}'`
    );
  }

  // Anthropic fallback. We don't try/catch here on purpose — if Anthropic
  // is also down, that's a real outage the caller should see.
  const text = await callAnthropic({
    model: ANTHROPIC_FALLBACK.model,
    system: input.system,
    messages: input.messages,
    maxTokens: input.maxTokens,
    cacheSystem,
    temperature: input.temperature,
  });
  return { text, model: ANTHROPIC_FALLBACK.model, provider: "anthropic" };
}
