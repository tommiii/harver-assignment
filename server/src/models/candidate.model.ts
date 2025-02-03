export interface Candidate {
  id: string;
  vacancyId: string;
  applicationOrder: number; // the lower the better
  averageModuleScores: number;
} 