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

      {caseUrl && caseId && (
        <NotifyButton caseId={caseId} summary={summary} caseUrl={caseUrl} />
      )}
    </main>
  );
}
