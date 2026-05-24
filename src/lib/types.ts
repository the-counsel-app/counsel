export interface CaseSummary {
  qualifyingSignal: string;
  incidentSummary: string;
  injuriesClaimed: string[];
  liabilityExposure: "Low" | "Medium" | "High";
  credibilityRating: number;
  caseStrengths: string[];
  caseWeaknesses: string[];
  missingInformation: string[];
  recommendation: string;
}
