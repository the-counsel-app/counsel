@AGENTS.md

# Counsel — AI Legal Intake App

Personal injury intake demo. Key legal insight: AI conversations supervised by a licensed attorney are protected by attorney-client privilege (unlike generic ChatGPT usage). Business model: referral fees from law firms.

## App flow

```
/ (landing)  →  /chat (AI intake)  →  /summary (case eval)  →  /referral (attorney match)
```

State passes via `sessionStorage` (`intakeMessages`, `caseSummary`). No database.

## Tech stack

- **Next.js 16** App Router, TypeScript — `src/app/` layout
- **AI SDK v6** (`ai@6.x`) + `@ai-sdk/anthropic@3.x` — model: `claude-sonnet-4-6`
- **Tailwind v4** — CSS variables defined in `globals.css` via `@theme inline`; use named classes like `bg-navy`, `text-gold`, `border-navy-lighter`
- **Vercel** for deployment; requires `ANTHROPIC_API_KEY` in env

## Key patterns

### Chat streaming — custom fetch, NOT `useChat`
`useChat` hook is broken in AI SDK v6. `ChatInterface.tsx` streams manually:
```
fetch("/api/chat") → ReadableStream → TextDecoder → setState per chunk
```
Do not replace this with `useChat`.

### Intake completion signal
`/api/chat` uses `streamText` with edge runtime. The system prompt instructs the model to begin its final message with `[INTAKE_COMPLETE]` (no leading whitespace). `ChatInterface.tsx` watches for this token to show the CTA button.

### Case summary — `generateObject`
`/api/summary` uses `generateObject` with a Zod schema to produce structured JSON (incidentSummary, injuriesClaimed, liabilityExposure, credibilityRating, caseStrengths, caseWeaknesses, recommendation). Returns `Response.json(object)`.

## Key files

| File | Purpose |
|------|---------|
| `src/lib/intakeSystemPrompt.ts` | Full system prompt — five intake categories + [INTAKE_COMPLETE] instructions |
| `src/components/ChatInterface.tsx` | All chat state, streaming, intake-complete detection, keyboard/viewport handling |
| `src/app/api/chat/route.ts` | Edge route: `streamText → toTextStreamResponse()` |
| `src/app/api/summary/route.ts` | Node route: `generateObject` with Zod schema, `maxDuration = 60` |
| `src/app/globals.css` | Tailwind v4 `@theme inline` block defining brand color tokens |

## Brand colors (Tailwind classes)

| Class | Hex |
|-------|-----|
| `bg-navy` / `text-navy` | `#0f172a` |
| `bg-navy-light` | `#1e293b` |
| `bg-navy-lighter` / `border-navy-lighter` | `#334155` |
| `bg-gold` / `text-gold` | `#d4af37` |
| `bg-gold-light` | `#e8c44a` |

## Demo shortcut

Typing `gen fake report` in the chat input replaces the conversation with a pre-scripted fake case (rear-end accident on I-90, $18k bills, possible shoulder surgery) to demo the full flow without running a real AI conversation.

## Dev

```bash
npm run dev   # http://localhost:3000
npm run build
```

Requires `ANTHROPIC_API_KEY` in `.env.local`.
