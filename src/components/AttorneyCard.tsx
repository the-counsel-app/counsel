"use client";

import { useState } from "react";
import type { Attorney } from "@/lib/mockAttorneys";

interface AttorneyCardProps {
  attorney: Attorney;
}

export default function AttorneyCard({ attorney }: AttorneyCardProps) {
  const [connected, setConnected] = useState(false);

  return (
    <div
      className={`relative bg-navy-light rounded-xl p-6 border transition-colors ${
        attorney.bestMatch
          ? "border-gold/50 shadow-[0_0_20px_rgba(212,175,55,0.1)]"
          : "border-navy-lighter"
      }`}
    >
      {attorney.bestMatch && (
        <div className="absolute -top-3 left-5 px-3 py-0.5 bg-gold text-navy text-xs font-bold rounded-full">
          Best Match
        </div>
      )}

      <div className="flex items-start gap-4 mb-4">
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center text-navy font-bold text-lg shrink-0"
          style={{ backgroundColor: attorney.avatarColor }}
        >
          {attorney.initials}
        </div>
        <div>
          <h3 className="font-semibold text-slate-100">{attorney.name}</h3>
          <p className="text-sm text-slate-400">{attorney.firm}</p>
          <p className="text-xs text-slate-500 mt-0.5">{attorney.location}</p>
        </div>
      </div>

      <p className="text-xs text-slate-400 mb-4">{attorney.specialty}</p>

      <div className="flex gap-4 mb-5 text-center">
        <div className="flex-1">
          <p className="text-lg font-bold text-gold">{attorney.experience}y</p>
          <p className="text-xs text-slate-500">Experience</p>
        </div>
        <div className="flex-1">
          <p className="text-lg font-bold text-gold">{attorney.rating}</p>
          <p className="text-xs text-slate-500">Rating</p>
        </div>
        <div className="flex-1">
          <p className="text-lg font-bold text-gold">{attorney.cases}</p>
          <p className="text-xs text-slate-500">Cases Won</p>
        </div>
      </div>

      <button
        onClick={() => setConnected(true)}
        className={`w-full py-2.5 rounded-lg text-sm font-semibold transition-colors ${
          connected
            ? "bg-green-900/40 text-green-400 border border-green-700/40 cursor-default"
            : attorney.bestMatch
            ? "bg-gold hover:bg-gold-light text-navy"
            : "bg-navy-lighter hover:bg-slate-600 text-slate-100 border border-navy-lighter"
        }`}
      >
        {connected ? "✓ Request Sent" : "Get Connected"}
      </button>
    </div>
  );
}
