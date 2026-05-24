import type { CaseSummary } from "@/lib/types";

interface CaseSummaryCardProps {
  summary: CaseSummary;
}

const liabilityColors: Record<string, string> = {
  Low: "bg-green-900/40 text-green-400 border-green-700/40",
  Medium: "bg-amber-900/40 text-amber-400 border-amber-700/40",
  High: "bg-red-900/40 text-red-400 border-red-700/40",
};

export default function CaseSummaryCard({ summary }: CaseSummaryCardProps) {
  const rating = Math.min(10, Math.max(1, Math.round(summary.credibilityRating)));

  return (
    <div className="space-y-5">
      {/* Incident Summary */}
      <div className="bg-navy-light rounded-xl p-5 border border-navy-lighter">
        <h3 className="text-xs font-semibold text-gold uppercase tracking-widest mb-2">
          Incident Summary
        </h3>
        <p className="text-sm text-slate-300 leading-relaxed">
          {summary.incidentSummary}
        </p>
      </div>

      {/* Injuries + Exposure row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-navy-light rounded-xl p-5 border border-navy-lighter">
          <h3 className="text-xs font-semibold text-gold uppercase tracking-widest mb-3">
            Injuries Claimed
          </h3>
          <ul className="space-y-1.5">
            {summary.injuriesClaimed.map((injury, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-gold shrink-0" />
                {injury}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-navy-light rounded-xl p-5 border border-navy-lighter flex flex-col gap-4">
          <div>
            <h3 className="text-xs font-semibold text-gold uppercase tracking-widest mb-2">
              Liability Exposure
            </h3>
            <span
              className={`inline-block px-3 py-1 rounded-full text-sm font-semibold border ${
                liabilityColors[summary.liabilityExposure] ?? liabilityColors.Medium
              }`}
            >
              {summary.liabilityExposure}
            </span>
          </div>
          <div>
            <h3 className="text-xs font-semibold text-gold uppercase tracking-widest mb-2">
              Credibility Rating
            </h3>
            <div className="flex gap-1 items-center">
              {Array.from({ length: 10 }).map((_, i) => (
                <div
                  key={i}
                  className={`h-2 flex-1 rounded-full ${
                    i < rating ? "bg-gold" : "bg-navy-lighter"
                  }`}
                />
              ))}
              <span className="ml-2 text-sm font-semibold text-gold">
                {rating}/10
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Strengths + Weaknesses */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-navy-light rounded-xl p-5 border border-navy-lighter">
          <h3 className="text-xs font-semibold text-green-400 uppercase tracking-widest mb-3">
            Case Strengths
          </h3>
          <ul className="space-y-1.5">
            {summary.caseStrengths.map((s, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                <span className="text-green-400 mt-0.5">✓</span>
                {s}
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-navy-light rounded-xl p-5 border border-navy-lighter">
          <h3 className="text-xs font-semibold text-red-400 uppercase tracking-widest mb-3">
            Areas of Concern
          </h3>
          <ul className="space-y-1.5">
            {summary.caseWeaknesses.map((w, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                <span className="text-red-400 mt-0.5">✗</span>
                {w}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Missing Information */}
      {summary.missingInformation.length > 0 && (
        <div className="bg-navy-light rounded-xl p-5 border border-amber-700/40">
          <h3 className="text-xs font-semibold text-amber-400 uppercase tracking-widest mb-3">
            Documents &amp; Information Still Needed
          </h3>
          <ul className="space-y-1.5">
            {summary.missingInformation.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                <span className="text-amber-400 mt-0.5 shrink-0">○</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Recommendation */}
      <div className="bg-gold/10 rounded-xl p-5 border border-gold/25">
        <h3 className="text-xs font-semibold text-gold uppercase tracking-widest mb-2">
          Recommendation
        </h3>
        <p className="text-sm text-slate-200 leading-relaxed">
          {summary.recommendation}
        </p>
      </div>
    </div>
  );
}
