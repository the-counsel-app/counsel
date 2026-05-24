import { Redis } from "@upstash/redis";
import { notFound } from "next/navigation";
import CaseSummaryCard from "@/components/CaseSummaryCard";
import type { CaseSummary } from "@/lib/types";

async function getCase(id: string): Promise<CaseSummary | null> {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  try {
    const redis = new Redis({ url, token });
    return await redis.get<CaseSummary>(`case:${id}`);
  } catch {
    return null;
  }
}

export default async function CasePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const summary = await getCase(id);

  if (!summary) notFound();

  const ref = id.slice(0, 8).toUpperCase();

  return (
    <main className="min-h-screen bg-navy px-4 py-10 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-2">
        <span className="text-gold font-bold tracking-widest text-sm">COUNSEL</span>
        <span className="text-slate-500 text-xs">Confidential · Attorney Review</span>
      </div>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-100 mt-6 mb-1">Case Packet</h1>
        <p className="text-slate-500 text-sm">
          Ref #{ref} · Prepared by Counsel AI · Personal Injury Intake
        </p>
      </div>

      <CaseSummaryCard summary={summary} />

      <footer className="mt-10 text-center text-xs text-slate-700">
        Counsel · Confidential · For Attorney Use Only
      </footer>
    </main>
  );
}
