export interface VacancyMatch {
  vacancyId: string; // 24-character hex string
  hiringLimit: number; // < 1,000,000
  candidates: VacancyCandidate[];
}

export interface VacancyCandidate {
  candidateId: string; // 24-character hex string
  averageScore: number; // Rounded to nearest integer
  moduleScores: (number | null)[]; // null represents 'X', numbers are 0-100 with max 2 decimals
}
