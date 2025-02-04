import { Candidate, MatchOutput, Vacancy } from "../models";
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

  private validateAndSplitInput(dataString: string): { vacanciesDataString: string; candidateDataString: string } {
    if (!dataString) {
      logger.error("Input data string is empty or undefined");
      throw new Error("Input data string is empty or undefined");
    }

    if (!dataString.includes("=")) {
      logger.error("Invalid input format: missing separator '='");
      throw new Error("Invalid input format: missing separator '='");
    }

    const [vacanciesDataString, candidateDataString] = dataString.split("=");

    if (!vacanciesDataString?.trim()) {
      logger.error("Vacancies data is empty or contains only whitespace");
      throw new Error("Vacancies data is empty or contains only whitespace");
    }

    if (!candidateDataString?.trim()) {
      logger.error("Candidates data is empty or contains only whitespace");
      throw new Error("Candidates data is empty or contains only whitespace");
    }

    const vacancyLines = vacanciesDataString.trim().split('\n');
    if (vacancyLines.length < 2 || !vacancyLines[0].includes('Vacancy Id,Hiring Limit')) {
      logger.error("No vacancies found in the input data");
      throw new Error("No vacancies found in the input data");
    }
    
    const candidateLines = candidateDataString.trim().split('\n');
    if (candidateLines.length < 2 || !candidateLines[0].includes('Vacancy Id,Candidate Id')) {
      logger.error("No candidates found in the input data");
      throw new Error("No candidates found in the input data");
    }

    return { vacanciesDataString, candidateDataString };
  }

  public match(dataString: string) {
    logger.info("Starting match process");
    
    const { vacanciesDataString, candidateDataString } = this.validateAndSplitInput(dataString);

    const vacancies =
      this.vacanciesService.parserVacanciesFromString(vacanciesDataString);
    const candidates =
      this.candidatesService.parserCandidatesFromString(candidateDataString);

    if (vacancies.length === 0) {
      logger.error("No vacancies found in the input data");
      throw new Error("No vacancies found in the input data");
    }

    if (candidates.length === 0) {
      logger.error("No candidates found in the input data");
      throw new Error("No candidates found in the input data");
    }

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
