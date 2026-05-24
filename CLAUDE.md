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

## Business context

Co-founder docs live in `docs/`:
- `docs/strategy.txt` — marketplace vs. firm-embedded SaaS decision; narrow focus (NYC, plaintiff, car accidents); pilot structure
- `docs/risks.txt` — legal risks: privilege claim, UPL, referral fee prohibition, data security
- `docs/ideas.txt` — product feature ideas: case packet, evidence collection, voice input, deposition prep
- `docs/todo.txt` — prioritized next steps (co-founder attorney question is #1; legal ethics opinion is #3)

**For coding decisions:** The target output is a formatted *case packet*, not just a referral button. The `/summary` and `/referral` pages should eventually produce a printable attorney-ready case file. One co-founder is a licensed attorney — the firm-embedded SaaS structure (intake hosted on the law firm's site) is the likely legal architecture, not a consumer marketplace.

## Keeping docs/ up to date

**After any conversation that surfaces new risks, ideas, or strategic decisions:** update the relevant file(s) in `docs/` to capture the new information before the session ends.

**After any coding change that completes a todo item:** remove or mark that item done in `docs/todo.txt`. If the work also reveals something new (a constraint, a decision made, a risk encountered), add it to the appropriate doc.

**When to update each file:**
- `docs/risks.txt` — new legal, technical, or business risks surface; existing risks are resolved or change severity
- `docs/ideas.txt` — new feature ideas discussed; ideas are ruled out with a reason worth remembering
- `docs/strategy.txt` — a strategic decision is made or changed (e.g., marketplace vs. SaaS resolved, target geography locked)
- `docs/todo.txt` — a task is completed via code or confirmed done by the user; a new blocking dependency is discovered; priority order changes

## Dev

```bash
npm run dev   # http://localhost:3000
npm run build
```

Requires `ANTHROPIC_API_KEY` in `.env.local`.
