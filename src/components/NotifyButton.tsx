"use client";

import { useState } from "react";
import type { CaseSummary } from "@/lib/types";

interface Props {
  caseId: string;
  summary: CaseSummary;
  caseUrl: string;
}

export default function NotifyButton({ caseId, summary, caseUrl }: Props) {
  const [state, setState] = useState<"idle" | "loading" | "sent" | "error">("idle");
  const [copied, setCopied] = useState(false);

  async function handleNotify() {
    setState("loading");
    try {
      const res = await fetch("/api/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          caseId,
          qualifyingSignal: summary.qualifyingSignal,
          incidentSummary: summary.incidentSummary,
          injuriesClaimed: summary.injuriesClaimed,
          caseUrl,
        }),
      });
      if (!res.ok) throw new Error("Failed");
      setState("sent");
    } catch {
      setState("error");
    }
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(caseUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="mt-8 p-5 bg-navy-light rounded-xl border border-navy-lighter space-y-3">
      <p className="text-xs font-semibold text-gold uppercase tracking-widest">
        Attorney Case Link
      </p>
      <div className="flex items-center gap-2">
        <p className="text-xs text-slate-400 font-mono flex-1 break-all">{caseUrl}</p>
        <button
          onClick={handleCopy}
          className="shrink-0 px-3 py-1.5 text-xs text-slate-300 border border-navy-lighter rounded-lg hover:border-slate-500 transition-colors"
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
      <button
        onClick={handleNotify}
        disabled={state === "loading" || state === "sent"}
        className="w-full sm:w-auto px-5 py-2.5 bg-gold hover:bg-gold-light disabled:opacity-60 disabled:cursor-not-allowed text-navy font-semibold text-sm rounded-lg transition-colors"
      >
        {state === "loading"
          ? "Sending…"
          : state === "sent"
          ? "✓ Attorney Notified"
          : state === "error"
          ? "Error — Retry"
          : "Email Attorney"}
      </button>
      {state === "error" && (
        <p className="text-xs text-red-400">Failed to send. Check RESEND_API_KEY and ATTORNEY_EMAIL in .env.local.</p>
      )}
    </div>
  );
}
