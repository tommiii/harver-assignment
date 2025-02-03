import { Candidate, MatchOutput, Vacancy } from "../types";
import { CandidatesService } from "./candidates.service";
import { VacanciesService } from "./vacancies.service";

export class MatchEngineService {
  private candidatesService: CandidatesService;
  private vacanciesService: VacanciesService;

  constructor() {
    this.candidatesService = new CandidatesService();
    this.vacanciesService = new VacanciesService();
  }

  private calculateBestCandidates(
    candidate: Candidate[],
    vacancies: Vacancy[]
  ): MatchOutput[] {
    const output: MatchOutput[] = [];
    vacancies.forEach((vacancy) => {
      const candidatesForVacancy = candidate.filter(
        (c) => c.vacancyId === vacancy.id
      );
      const candidatesForVacancySorted = candidatesForVacancy.sort(
        (candidateA, candidateB) => {
          if (
            candidateA.averageModuleScores === candidateB.averageModuleScores
          ) {
            return candidateA.applicationOrder - candidateB.applicationOrder;
          }
          return (
            candidateB.averageModuleScores - candidateA.averageModuleScores
          );
        }
      );
      const bestCandidates = candidatesForVacancySorted.slice(
        0,
        vacancy.hiringLimit
      );

      output.push({
        vacancyId: vacancy.id,
        hiringLimit: vacancy.hiringLimit,
        candidates: bestCandidates,
      });
    });
    return output;
  }

  public match(dataString: string) {
    const [vacanciesDataString, candidateDataString] = dataString.split("=");
    const vacancies =
      this.vacanciesService.parserVacanciesFromString(vacanciesDataString);
    const candidates =
      this.candidatesService.parserCandidatesFromString(candidateDataString);

    const outputData = this.calculateBestCandidates(candidates, vacancies);

    return outputData;
  }
}
