import { Candidate, MatchOutput, Vacancy } from "../types";
import { CandidatesService } from "./candidates.service";
import { VacanciesService } from "./vacancies.service";
import logger from "../utils/logger";

export class MatchEngineService {
  private candidatesService: CandidatesService;
  private vacanciesService: VacanciesService;

  constructor() {
    this.candidatesService = new CandidatesService();
    this.vacanciesService = new VacanciesService();
    logger.debug("MatchEngineService initialized");
  }

  private calculateBestCandidates(
    candidates: Candidate[],
    vacancies: Vacancy[]
  ): MatchOutput[] {
    logger.debug({ candidatesCount: candidates.length, vacanciesCount: vacancies.length }, "Starting best candidates calculation");
    
    const output: MatchOutput[] = [];
    vacancies.forEach((vacancy) => {
      const candidatesForVacancy = candidates.filter(
        (c) => c.vacancyId === vacancy.id
      );
      logger.debug(
        { 
          vacancyId: vacancy.id, 
          candidatesCount: candidatesForVacancy.length,
          hiringLimit: vacancy.hiringLimit 
        }, 
        "Processing vacancy candidates"
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

      logger.debug(
        { 
          vacancyId: vacancy.id, 
          selectedCandidates: bestCandidates.length 
        }, 
        "Selected best candidates for vacancy"
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
    logger.info("Starting match process");
    
    const [vacanciesDataString, candidateDataString] = dataString.split("=");
    logger.debug("Split input data into vacancies and candidates sections");

    const vacancies =
      this.vacanciesService.parserVacanciesFromString(vacanciesDataString);
    const candidates =
      this.candidatesService.parserCandidatesFromString(candidateDataString);

    logger.debug(
      { 
        parsedVacancies: vacancies.length, 
        parsedCandidates: candidates.length 
      }, 
      "Parsed input data"
    );

    const outputData = this.calculateBestCandidates(candidates, vacancies);
    
    logger.info(
      { 
        totalMatches: outputData.reduce((acc, match) => acc + match.candidates.length, 0),
        vacanciesFilled: outputData.length 
      }, 
      "Match process completed"
    );

    return outputData;
  }
}
