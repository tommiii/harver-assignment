export interface Candidate {
  id: string;
  vacancyId: string;
  applicationOrder: number; // the lower the better
  averageModuleScores: number;
}

export interface MatchOutput {
  vacancyId: string;
  hiringLimit: number;
  candidates: Candidate[];
}
