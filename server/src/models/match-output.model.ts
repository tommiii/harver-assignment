import { Candidate } from './candidate.model';

export interface MatchOutput {
  vacancyId: string;
  hiringLimit: number;
  candidates: Candidate[];
} 