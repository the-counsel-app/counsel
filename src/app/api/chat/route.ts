import { anthropic } from "@ai-sdk/anthropic";
import { streamText } from "ai";
import { intakeSystemPrompt } from "@/lib/intakeSystemPrompt";

export const runtime = "edge";

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: anthropic("claude-sonnet-4-6"),
    system: intakeSystemPrompt,
    messages,
    maxOutputTokens: 1024,
  });

  return result.toTextStreamResponse();
}
