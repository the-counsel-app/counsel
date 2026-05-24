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

  if (state === "sent") {
    return (
      <div className="mt-8 p-6 bg-navy-light rounded-xl border border-gold/30 text-center">
        <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-3">
          <svg className="w-5 h-5 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <p className="text-slate-100 font-semibold mb-1">Case Submitted</p>
        <p className="text-slate-400 text-sm">
          Your case has been submitted to Mitchell &amp; Associates. They'll be in touch within 24 hours.
        </p>
      </div>
    );
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
        disabled={state === "loading"}
        className="w-full sm:w-auto px-5 py-2.5 bg-gold hover:bg-gold-light disabled:opacity-60 disabled:cursor-not-allowed text-navy font-semibold text-sm rounded-lg transition-colors"
      >
        {state === "loading" ? "Sending…" : state === "error" ? "Error — Retry" : "Submit to Mitchell & Associates"}
      </button>
      {state === "error" && (
        <p className="text-xs text-red-400">Failed to send. Check RESEND_API_KEY and ATTORNEY_EMAIL in .env.local.</p>
      )}
    </div>
  );
}
