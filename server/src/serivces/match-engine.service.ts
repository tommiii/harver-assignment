import { Candidate, Vacancy } from "../types";
import { CandidatesService } from "./candidates.service";
import { VacanciesService } from "./vacancies.service";

export class MatchEngineService {
  private candidatesService: CandidatesService;
  private vacanciesService: VacanciesService;

  constructor() {
    this.candidatesService = new CandidatesService();
    this.vacanciesService = new VacanciesService();
  }

  public match(dataString: string) {
    const [vacanciesDataString, candidateDataString] = dataString.split("=");
    const vacancies =
      this.vacanciesService.parserVacanciesFromString(vacanciesDataString);
    const candidates =
      this.candidatesService.parserCandidatesFromString(candidateDataString);

    const output = {
      vacancies,
      candidates,
    };

    console.log(JSON.stringify(output, null, 2));

    return output;
  }
}
