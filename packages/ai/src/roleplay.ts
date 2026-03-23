import Anthropic from "@anthropic-ai/sdk";
import { getScenario } from "./scenarios";

const client = new Anthropic();

interface Message {
  role: string;
  content: string;
}

interface RoleplayInput {
  scenarioId: number;
  messages: Message[];
}

export async function createClinicalRoleplay({
  scenarioId,
  messages,
}: RoleplayInput): Promise<string> {
  const scenario = getScenario(scenarioId);
  if (!scenario) throw new Error(`Scenario ${scenarioId} not found`);

  const systemPrompt = `You are an AI simulating a patient for AMC CAT 2 (clinical examination) practice.

PATIENT PROFILE:
- ${scenario.patientProfile}
- Chief complaint: ${scenario.chiefComplaint}
- Underlying diagnosis (do NOT reveal unless directly and correctly diagnosed): ${scenario.underlyingDiagnosis}

YOUR ROLE:
- Respond as this patient would in a real GP consultation
- Be realistic: anxious, sometimes vague, give information when asked directly
- Do NOT volunteer all information at once — the doctor must ask appropriately
- React emotionally appropriately (worried, relieved, confused, etc.)
- If the doctor asks something outside normal history taking, respond naturally

RED FLAGS you have (reveal only if asked about relevant symptoms):
${scenario.redFlags.map((r) => `- ${r}`).join("\n")}

CLINICAL FRAMEWORK (for your internal guidance, do NOT mention to the doctor):
- Murtagh pearls: ${scenario.murtaghPearls.join("; ")}
- AMC marking criteria the doctor should meet: ${scenario.amcMarkingCriteria.join("; ")}
${scenario.redBookGuidelines ? `- RACGP Red Book: ${scenario.redBookGuidelines.join("; ")}` : ""}

After the consultation ends (when the doctor says "thank you" or "that's all"), provide structured examiner feedback:
1. What the doctor did well
2. What was missed
3. AMC marking criteria met/missed
4. Clinical pearls from Murtagh
5. Overall score /10`;

  const response = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 1024,
    system: systemPrompt,
    messages: messages
      .filter((m) => m.role === "user" || m.role === "assistant")
      .map((m) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })),
  });

  const block = response.content[0];
  if (!block || block.type !== "text") throw new Error("Unexpected response type from AI");
  return block.text;
}
