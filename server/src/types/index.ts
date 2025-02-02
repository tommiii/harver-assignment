export interface Candidate {
  id: string;
  vacancyId: string;
  moduleScores: number[];
}

export interface Vacancy {
  id: string;
  hiringLimit: number;
}
