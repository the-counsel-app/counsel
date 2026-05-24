"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import CaseSummaryCard from "@/components/CaseSummaryCard";
import NotifyButton from "@/components/NotifyButton";
import type { CaseSummary } from "@/lib/types";

function getBaseUrl() {
  if (typeof window !== "undefined") return window.location.origin;
  return process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
}

export default function SummaryPage() {
  const [summary, setSummary] = useState<CaseSummary | null>(null);
  const [caseId, setCaseId] = useState<string | null>(null);
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem("caseSummary");
    const storedId = sessionStorage.getItem("caseId");
    if (!stored) {
      setMissing(true);
      return;
    }
    try {
      setSummary(JSON.parse(stored));
      if (storedId) setCaseId(storedId);
    } catch {
      setMissing(true);
    }
  }, []);

  if (missing) {
    return (
      <main className="flex flex-col items-center justify-center min-h-screen px-6 text-center">
        <p className="text-slate-400 mb-4">No case data found.</p>
        <Link
          href="/chat"
          className="px-5 py-2.5 bg-gold text-navy font-semibold rounded-lg text-sm"
        >
          Start Intake
        </Link>
      </main>
    );
  }

  if (!summary) {
    return (
      <main className="flex items-center justify-center min-h-screen">
        <div className="w-6 h-6 border-2 border-gold border-t-transparent rounded-full animate-spin" />
      </main>
    );
  }

  const caseUrl = caseId ? `${getBaseUrl()}/case/${caseId}` : null;

  return (
    <main className="min-h-screen bg-navy px-4 py-10 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-gold font-bold tracking-widest text-sm">COUNSEL</span>
        <span className="text-slate-500 text-xs">Confidential · Attorney-Client Privilege</span>
      </div>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-100 mt-6 mb-1">
          Case Evaluation
        </h1>
        <p className="text-slate-500 text-sm">
          Prepared by Counsel AI · For Attorney Sarah Mitchell · Mitchell &amp; Associates
        </p>
      </div>

      <CaseSummaryCard summary={summary} />

      {caseUrl && caseId ? (
        <NotifyButton caseId={caseId} summary={summary} caseUrl={caseUrl} />
      ) : (
        <div className="mt-8 flex flex-col sm:flex-row gap-3 items-center">
          <Link
            href="/referral"
            className="inline-flex items-center gap-2 px-7 py-3.5 bg-gold hover:bg-gold-light text-navy font-bold rounded-xl text-sm transition-colors"
          >
            Find an Attorney
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </Link>
          <Link href="/chat" className="text-slate-500 hover:text-slate-300 text-sm transition-colors">
            ← Start over
          </Link>
        </div>
      )}
    </main>
  );
}
