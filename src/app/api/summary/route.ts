import { anthropic } from "@ai-sdk/anthropic";
import { generateObject, type ModelMessage } from "ai";
import { z } from "zod";

export const maxDuration = 60;

const summarySchema = z.object({
  incidentSummary: z.string().describe("2-3 sentence summary of what happened"),
  injuriesClaimed: z.array(z.string()).min(1).describe("List each injury mentioned"),
  liabilityExposure: z.enum(["Low", "Medium", "High"]),
  credibilityRating: z.number().int().min(1).max(10),
  caseStrengths: z.array(z.string()).min(1),
  caseWeaknesses: z.array(z.string()).min(1),
  missingInformation: z.array(z.string()).describe("Documents, evidence, or key details not yet collected that the attorney will need — e.g. 'Police report number', 'Medical records from treating physicians', 'Photos from the accident scene'. Empty array if nothing is missing."),
  recommendation: z.string().describe("1-2 sentence recommendation for the attorney"),
});

const SUMMARY_SYSTEM = `You are a legal case analyst reviewing a personal injury intake conversation. Analyze the conversation and provide a structured case evaluation.`;

export async function POST(req: Request) {
  let messages: ModelMessage[];
  try {
    const body = await req.json();
    messages = body.messages as ModelMessage[];
    while (messages.length > 0 && messages[0].role !== "user") {
      messages = messages.slice(1);
    }
    while (messages.length > 0 && messages[messages.length - 1].role !== "user") {
      messages = messages.slice(0, -1);
    }
    if (messages.length === 0) {
      return Response.json({ error: "No conversation to summarize" }, { status: 400 });
    }
  } catch {
    return Response.json({ error: "Invalid request body" }, { status: 400 });
  }

  try {
    const { object } = await generateObject({
      model: anthropic("claude-sonnet-4-6"),
      system: SUMMARY_SYSTEM,
      messages,
      schema: summarySchema,
      maxOutputTokens: 1024,
    });
    return Response.json(object);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("Summary generation failed:", message);
    return Response.json(
      { error: `Failed to generate summary. Please try again.` },
      { status: 500 }
    );
  }
}
