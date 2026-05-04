import { NextRequest, NextResponse } from "next/server";
import { runChat } from "@mostly-medicine/ai";
import { aiRateLimit, clientKey } from "@/lib/rate-limit";

// Public, auth-bypassed taste route. Hard-capped to a few short turns per
// IP so a curious visitor can experience the AMC Clinical Roleplay product
// in under 5 minutes without signing up. NOT linked from /dashboard, NOT
// part of the authed roleplay flow — this is a top-of-funnel taster only.

// Hard cap: a session is 5 user turns. The client also enforces this, but we
// re-enforce on the server so a hand-rolled curl can't exceed it. Session
// budget is `MAX_USER_TURNS` user messages — anything past that is rejected.
const MAX_USER_TURNS = 5;

// Per-IP cap on raw API hits to /api/try-roleplay across a rolling hour.
// 5 turns/session * 3 sessions + a couple of classify calls = ~20 hits is
// plenty for a curious visitor; 30/hour blocks scripted abuse cheaply.
const HOURLY_IP_MAX = 30;
const HOURLY_WINDOW_MS = 60 * 60 * 1000;

// Pre-baked sample case — kept here so the route is fully self-contained
// and never touches the DB. The persona and the "what they reveal when
// asked" buckets mirror the structure of packages/ai/src/scenarios.ts so
// the experience tracks the real product.
const SAMPLE_CASE = {
  patientName: "Mr Anil Sharma",
  patientAge: 45,
  patientGender: "male" as const,
  setting: "GP clinic",
  candidateTask:
    "Take a focused history from this patient presenting with chest pain, then explain your differential and immediate plan.",
  openingStatement:
    "Doctor, I've been having this chest pain for the last two hours and I'm a bit worried.",
  // What the patient volunteers without prompting — drip these in naturally.
  historyWithoutPrompting: [
    "Pain came on while I was walking up the stairs at home, about two hours ago.",
    "It feels like a heaviness, dull ache in the centre of my chest.",
    "I felt a bit short of breath and sweaty when it started.",
  ].join("\n"),
  // Reveal ONLY when directly asked.
  historyWithPrompting: [
    "Severity right now is about 6/10, was 8/10 at the start.",
    "Pain radiates into my left arm and jaw a little.",
    "It eased a bit when I sat down, but never fully went away.",
    "No nausea or vomiting, but I feel unsettled.",
    "I'm a smoker — about 15 cigarettes a day for 20 years.",
    "My father had a heart attack at 52.",
    "I have high blood pressure, on amlodipine 5 mg daily.",
    "Cholesterol was high last year, GP started me on rosuvastatin but I stopped it after a month.",
    "I had a similar but milder pain last week walking the dog, settled in 5 minutes.",
    "No previous heart attacks, no chest pain investigations before.",
    "I drink 2 beers most evenings, no recreational drugs.",
    "I work as an accountant — fairly sedentary.",
  ].join("\n"),
  patientQuestions: [
    "Is this a heart attack, doctor?",
    "Should I be worried? My father died of a heart attack.",
  ],
  // Answers given ONLY if the doctor examines or explicitly asks.
  examFindings:
    "Looks anxious and clammy. BP 152/94. HR 92 regular. Respiratory rate 18. SpO2 97% on room air. Heart sounds normal, no murmurs. Chest clear. Abdomen soft. Calves non-tender.",
  underlyingDiagnosis: "Acute coronary syndrome (likely unstable angina / NSTEMI)",
};

// Build the system prompt once per call. Stable enough that prompt caching
// gives us a >90% input-token discount on the Anthropic fallback path.
const SYSTEM_PROMPT = `You are an AI roleplaying as a patient in an AMC (Australian Medical Council) Clinical Roleplay practice scenario. The user is a doctor practising for the AMC Clinical exam.

PATIENT PROFILE:
- Name: ${SAMPLE_CASE.patientName}
- Age: ${SAMPLE_CASE.patientAge}
- Gender: ${SAMPLE_CASE.patientGender}
- Setting: ${SAMPLE_CASE.setting}
- Underlying diagnosis (NEVER reveal unless the doctor diagnoses you correctly): ${SAMPLE_CASE.underlyingDiagnosis}

CANDIDATE TASK (what the doctor is meant to do):
${SAMPLE_CASE.candidateTask}

════════════════════════════════════════════════════════════
STRICT CONTENT BOUNDARIES — MANDATORY
════════════════════════════════════════════════════════════
You MUST NOT invent, extrapolate or assume any information beyond what is
explicitly listed below. If the doctor asks something not covered here,
respond naturally with "No, I don't think so", "Not that I've noticed",
"I'm not sure" — never fabricate a clinically plausible answer.

YOUR OPENING STATEMENT — say this verbatim as your first message:
"${SAMPLE_CASE.openingStatement}"

WHAT YOU VOLUNTEER WITHOUT PROMPTING (drip these in naturally over your turns, do NOT dump them all at once):
${SAMPLE_CASE.historyWithoutPrompting}

WHAT YOU REVEAL ONLY WHEN DIRECTLY ASKED (do NOT volunteer):
${SAMPLE_CASE.historyWithPrompting}

PHYSICAL EXAMINATION FINDINGS (reveal ONLY if the doctor examines you or asks specifically):
${SAMPLE_CASE.examFindings}

QUESTIONS YOU MAY ASK THE DOCTOR (weave in naturally, max one per turn):
${SAMPLE_CASE.patientQuestions.map((q) => `- ${q}`).join("\n")}

BEHAVIOURAL GUIDANCE:
- React anxiously but coherently — you're worried but not panicking.
- Speak in a single short paragraph (1-3 sentences). This is a roleplay, not a monologue.
- Do NOT volunteer the family history, smoking, statin non-adherence or last week's similar pain unless asked.
- Do NOT diagnose yourself or suggest treatments.
- Stay in character as the patient at all times. Never break the fourth wall.`;

interface ClientMessage {
  role: "user" | "assistant";
  content: string;
}

interface ClassifyRequest {
  classify: true;
  history: ClientMessage[];
}

interface ChatRequest {
  classify?: false;
  history: ClientMessage[];
}

type RequestBody = ChatRequest | ClassifyRequest;

function isClassifyRequest(body: RequestBody): body is ClassifyRequest {
  return body.classify === true;
}

export async function POST(req: NextRequest) {
  // Per-IP rolling-hour rate limit. We don't have authed user IDs here, so
  // clientKey() falls back to x-forwarded-for. Good enough to stop trivial
  // scripted abuse — not bulletproof, but Redis would be overkill for a
  // taste experience.
  const rl = await aiRateLimit(clientKey(req, "try-roleplay"), {
    max: HOURLY_IP_MAX,
    windowMs: HOURLY_WINDOW_MS,
  });
  if (!rl.allowed) {
    return NextResponse.json(
      {
        error: "rate_limited",
        message:
          "You've hit the free taste limit. Sign up free to keep practising — it takes 30 seconds.",
      },
      {
        status: 429,
        headers: {
          "Retry-After": String(Math.ceil((rl.retryAfterMs ?? HOURLY_WINDOW_MS) / 1000)),
        },
      }
    );
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { error: "AI not configured" },
      { status: 503 }
    );
  }

  let body: RequestBody;
  try {
    body = (await req.json()) as RequestBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const history = Array.isArray(body.history) ? body.history : [];
  // Re-validate every message shape — visitors can be hostile.
  const cleanHistory: ClientMessage[] = history
    .filter(
      (m): m is ClientMessage =>
        !!m &&
        (m.role === "user" || m.role === "assistant") &&
        typeof m.content === "string" &&
        m.content.length > 0 &&
        m.content.length < 2000
    )
    .slice(-20); // hard cap on transcript size we'll forward

  // Hard server-side cap on user turns per request — anything past 5 user
  // messages is rejected so a hand-rolled client can't run a 50-turn
  // conversation on our dime.
  const userTurns = cleanHistory.filter((m) => m.role === "user").length;
  if (userTurns > MAX_USER_TURNS) {
    return NextResponse.json(
      {
        error: "session_complete",
        message: "You've completed your free taste session. Sign up to keep going.",
      },
      { status: 403 }
    );
  }

  // Anthropic requires the messages array to start with "user". If the
  // visitor refreshes mid-flight and we get an empty history, we still need
  // to return the patient's opening line — handle by injecting a synthetic
  // "begin" user turn.
  const apiMessages: ClientMessage[] =
    cleanHistory.length === 0
      ? [{ role: "user", content: "(The doctor enters the room and greets you.)" }]
      : cleanHistory.map((m) => ({ role: m.role, content: m.content }));

  // Branch 1 — classification call after turn 5.
  if (isClassifyRequest(body)) {
    try {
      const result = await runChat({
        useCase: "taste_chat",
        system: SYSTEM_PROMPT,
        messages: [
          ...apiMessages,
          {
            role: "user",
            content:
              "BREAK CHARACTER. You are now a strict AMC examiner. Looking at the doctor's questions across this consultation, classify their consultation style as exactly ONE word from this list: empathetic, clinical, inquisitive, hesitant, structured. Then on a new line, count how many of these 5 differentials they reasonably explored: pain character, cardiac risk factors, family history, prior cardiac symptoms, examination request. Respond in this exact format and nothing else:\nstyle: <one_word>\ndifferentials_explored: <integer 0-5>",
          },
        ],
        maxTokens: 200,
        cacheSystem: true,
      });
      const text = result.text;
      const styleMatch = text.match(/style:\s*(\w+)/i);
      const diffMatch = text.match(/differentials_explored:\s*(\d+)/i);
      const style = styleMatch?.[1]?.toLowerCase() ?? "promising";
      const explored = Math.min(5, Math.max(0, parseInt(diffMatch?.[1] ?? "0", 10)));
      return NextResponse.json({ style, differentialsExplored: explored });
    } catch (err) {
      // Never fail the user-facing flow on classify — just hard-code a
      // graceful fallback so the result card still renders.
      console.error("[try-roleplay classify error]", err);
      return NextResponse.json({ style: "promising", differentialsExplored: 3 });
    }
  }

  // Branch 2 — normal patient reply.
  try {
    const result = await runChat({
      useCase: "taste_chat",
      system: SYSTEM_PROMPT,
      messages: apiMessages,
      maxTokens: 280, // patient turns are short
      cacheSystem: true,
    });
    if (!result.text) {
      return NextResponse.json({ error: "Unexpected AI response" }, { status: 502 });
    }
    return NextResponse.json({ reply: result.text, turnsRemaining: Math.max(0, MAX_USER_TURNS - userTurns) });
  } catch (err) {
    const message = err instanceof Error ? err.message : "AI error";
    console.error("[try-roleplay error]", message);
    return NextResponse.json({ error: "AI error" }, { status: 500 });
  }
}
