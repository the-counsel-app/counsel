"use client";

import { useRouter } from "next/navigation";

const DEMO_SUMMARY = {
  incidentSummary:
    "On March 15, 2026, the claimant was rear-ended at a red light on I-90 in Chicago by a driver who failed to brake in time. The claimant's vehicle sustained significant rear-end damage and airbags deployed. Chicago PD responded and filed an accident report on scene.",
  injuriesClaimed: [
    "Whiplash / cervical strain",
    "Lower back pain (lumbar)",
    "Recurring headaches",
    "Right shoulder soreness",
  ],
  liabilityExposure: "High" as const,
  credibilityRating: 7,
  caseStrengths: [
    "Clear liability — rear-end collision with police report",
    "ER visit same day, injuries documented immediately",
    "Ongoing treatment with orthopedic specialist (8 weeks)",
    "2 weeks lost wages confirmed by employer letter",
    "Vehicle damage photos and repair estimate on file",
  ],
  caseWeaknesses: [
    "Prior lower back treatment in 2023 creates causation dispute",
    "No independent witnesses beyond responding officer",
    "Claimant posted gym photos on Instagram 3 weeks post-accident",
  ],
  recommendation:
    "Strong settlement candidate. Recommend demand letter in the $85,000–$120,000 range given clear liability, documented injuries, and wage loss. Prior back history will reduce but not eliminate damages — prepare to counter with MRI comparison.",
};

export default function DemoButton() {
  const router = useRouter();

  function loadDemo() {
    sessionStorage.setItem("caseSummary", JSON.stringify(DEMO_SUMMARY));
    router.push("/summary");
  }

  return (
    <button
      onClick={loadDemo}
      className="text-slate-500 hover:text-slate-300 text-sm underline underline-offset-4 transition-colors"
    >
      Preview demo summary →
    </button>
  );
}
