import { anthropic } from "@ai-sdk/anthropic";
import { generateText, type ModelMessage } from "ai";

export const maxDuration = 60;

const SUMMARY_SYSTEM = `You are a legal case analyst. Your only job is to output a single JSON object — nothing else. No explanation, no markdown, no preamble, no text after the JSON.

Analyze the intake conversation and fill in every field:

{
  "incidentSummary": "2-3 sentence summary of what happened",
  "injuriesClaimed": ["list each injury mentioned"],
  "liabilityExposure": "Low",
  "credibilityRating": 7,
  "caseStrengths": ["list strengths"],
  "caseWeaknesses": ["list weaknesses or unknowns"],
  "recommendation": "1-2 sentence recommendation"
}

Rules:
- liabilityExposure must be exactly "Low", "Medium", or "High"
- credibilityRating must be a number 1-10
- All arrays must have at least one item
- Output the raw JSON object only — first character must be { and last must be }`;

export async function POST(req: Request) {
  let messages: ModelMessage[];
  try {
    const body = await req.json();
    messages = body.messages as ModelMessage[];
    // Anthropic requires the conversation to end with a user message
    while (messages.length > 0 && messages[messages.length - 1].role !== "user") {
      messages = messages.slice(0, -1);
    }
    if (messages.length === 0) {
      return Response.json({ error: "No conversation to summarize" }, { status: 400 });
    }
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

  console.log("Summary raw response (first 300):", text.slice(0, 300));

  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    console.error("No JSON found in response:", text.slice(0, 300));
    return Response.json(
      { error: `Failed to generate summary. Please try again.` },
      { status: 500 }
    );
  }

  try {
    const summary = JSON.parse(jsonMatch[0]);
    return Response.json(summary);
  } catch {
    console.error("JSON parse failed:", jsonMatch[0].slice(0, 300));
    return Response.json(
      { error: "Failed to parse summary. Please try again." },
      { status: 500 }
    );
  }
}
