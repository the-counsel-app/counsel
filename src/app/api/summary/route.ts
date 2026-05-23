import { anthropic } from "@ai-sdk/anthropic";
import { generateText, type ModelMessage } from "ai";

export const maxDuration = 60;

const SUMMARY_SYSTEM = `You are a legal case analyst. Review this personal injury intake conversation and output ONLY valid JSON — no markdown fencing, no explanation, no text before or after the JSON object.

Required schema (all fields required):
{
  "incidentSummary": "2-3 sentence summary of what happened",
  "injuriesClaimed": ["array of injuries mentioned"],
  "liabilityExposure": "Low" or "Medium" or "High",
  "credibilityRating": number from 1 to 10,
  "caseStrengths": ["array of factors that help the case"],
  "caseWeaknesses": ["array of factors that hurt the case or raise concerns"],
  "recommendation": "1-2 sentence recommendation on how to proceed"
}

Base your analysis on the full conversation. If information was not provided for a category, note it as a weakness or unknown factor.`;

export async function POST(req: Request) {
  let messages: ModelMessage[];
  try {
    const body = await req.json();
    messages = body.messages as ModelMessage[];
  } catch {
    return Response.json({ error: "Invalid request body" }, { status: 400 });
  }

  let text: string;
  try {
    const result = await generateText({
      model: anthropic("claude-sonnet-4-6"),
      system: SUMMARY_SYSTEM,
      messages,
      maxOutputTokens: 1024,
    });
    text = result.text;
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("Summary generation failed:", message);
    return Response.json(
      { error: `AI request failed: ${message}` },
      { status: 500 }
    );
  }

  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    console.error("No JSON in response:", text.slice(0, 200));
    return Response.json(
      { error: "Failed to generate summary. Please try again." },
      { status: 500 }
    );
  }

  try {
    const summary = JSON.parse(jsonMatch[0]);
    return Response.json(summary);
  } catch {
    return Response.json(
      { error: "Failed to parse summary. Please try again." },
      { status: 500 }
    );
  }
}
