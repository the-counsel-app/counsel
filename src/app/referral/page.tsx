import Link from "next/link";
import AttorneyCard from "@/components/AttorneyCard";
import { mockAttorneys } from "@/lib/mockAttorneys";

export default function ReferralPage() {
  return (
    <main className="min-h-screen bg-navy px-4 py-10 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <span className="text-gold font-bold tracking-widest text-sm">COUNSEL</span>
        <Link href="/summary" className="text-slate-500 hover:text-slate-300 text-xs transition-colors">
          ← Back to evaluation
        </Link>
      </div>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-100 mb-2">
          Matched Attorneys
        </h1>
        <p className="text-slate-500 text-sm">
          Based on your case evaluation, these personal injury attorneys are the
          best fit for your situation. Getting connected is free — attorney fees
          are collected only if you win.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {mockAttorneys.map((attorney) => (
          <AttorneyCard key={attorney.id} attorney={attorney} />
        ))}
      </div>

      <div className="mt-10 p-4 bg-navy-light rounded-xl border border-navy-lighter">
        <p className="text-xs text-slate-500 leading-relaxed">
          <strong className="text-slate-400">How referrals work:</strong> When you
          click &ldquo;Get Connected,&rdquo; your case evaluation is shared with the
          attorney&apos;s intake team. They will contact you within 24 hours to
          discuss representation. Counsel receives a referral fee from the law firm
          upon retention — there is no cost to you.
        </p>
      </div>

      <footer className="mt-10 text-center text-xs text-slate-700">
        Counsel · Mitchell &amp; Associates · Attorney-Client Privilege Applies
      </footer>
    </main>
  );
}
