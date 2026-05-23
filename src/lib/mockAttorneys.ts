export interface Attorney {
  id: string;
  name: string;
  firm: string;
  specialty: string;
  location: string;
  experience: number;
  rating: number;
  cases: number;
  initials: string;
  avatarColor: string;
  bestMatch?: boolean;
}

export const mockAttorneys: Attorney[] = [
  {
    id: "1",
    name: "Sarah Mitchell",
    firm: "Mitchell & Associates",
    specialty: "Personal Injury · Auto Accidents · Wrongful Death",
    location: "Chicago, IL",
    experience: 16,
    rating: 4.9,
    cases: 412,
    initials: "SM",
    avatarColor: "#d4af37",
    bestMatch: true,
  },
  {
    id: "2",
    name: "James Holloway",
    firm: "Holloway Injury Law",
    specialty: "Personal Injury · Slip & Fall · Workers' Comp",
    location: "Chicago, IL",
    experience: 18,
    rating: 4.8,
    cases: 338,
    initials: "JH",
    avatarColor: "#3b82f6",
  },
  {
    id: "3",
    name: "Diana Reyes",
    firm: "Reyes & Partners LLP",
    specialty: "Personal Injury · Medical Malpractice · Brain Injury",
    location: "Chicago, IL",
    experience: 12,
    rating: 4.7,
    cases: 195,
    initials: "DR",
    avatarColor: "#8b5cf6",
  },
];
