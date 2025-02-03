import {
  MAX_DECIMAL_PLACES,
  MAX_MODULE_SCORE,
  MIN_MODULE_SCORE,
  OBJECT_ID_REGEX,
} from "../constants";
import { Candidate } from "../types";
import logger from "../utils/logger";

export class CandidatesService {
  private validateId(id: string): void {
    if (!OBJECT_ID_REGEX.test(id)) {
      logger.warn({ id }, "Invalid ObjectId format detected");
      throw new Error(`Invalid 'Candidate Id': ${id} is not a valid ObjectId`);
    }
  }

  private validateModuleScore(score: string): void {
    if (score.toUpperCase() === "X") return;

    const numScore = parseFloat(score);
    if (isNaN(numScore)) {
      logger.warn({ score }, "Invalid score format detected");
      throw new Error(`Invalid score: ${score} is not a number or 'X'`);
    }

    if (numScore < MIN_MODULE_SCORE || numScore > MAX_MODULE_SCORE) {
      logger.warn({ score, min: MIN_MODULE_SCORE, max: MAX_MODULE_SCORE }, "Score out of valid range");
      throw new Error(
        `Score must be between ${MIN_MODULE_SCORE} and ${MAX_MODULE_SCORE}`
      );
    }

    const decimalPlaces = score.includes(".") ? score.split(".")[1].length : 0;
    if (decimalPlaces > MAX_DECIMAL_PLACES) {
      logger.warn({ score, decimalPlaces, maxAllowed: MAX_DECIMAL_PLACES }, "Too many decimal places in score");
      throw new Error(
        `Score can have maximum ${MAX_DECIMAL_PLACES} decimal places`
      );
    }
  }

  private validateHeader(candidatesHeaderString: string): void {
    const candidatesHeaders = candidatesHeaderString
      .split(",")
      .map((header) => header.trim());

    logger.debug({ headers: candidatesHeaders }, "Validating candidate headers");

    if (candidatesHeaders.length < 2) {
      logger.warn({ headerLength: candidatesHeaders.length }, "Invalid header length");
      throw new Error(
        `Invalid Candidate header: length must be greater than 2`
      );
    }

    if (candidatesHeaders[0] !== "Vacancy Id") {
      logger.warn({ firstHeader: candidatesHeaders[0] }, "Missing Vacancy Id header");
      throw new Error(`Invalid Candidate header: 'Vacancy Id' not found`);
    }

    if (candidatesHeaders[1] !== "Candidate Id") {
      logger.warn({ secondHeader: candidatesHeaders[1] }, "Missing Candidate Id header");
      throw new Error(`Invalid Candidate header: 'Candidate Id' not found`);
    }

    logger.debug("Header validation successful");
  }

  public parserCandidatesFromString(dataString: string): Candidate[] {
    logger.info("Starting to parse candidates data");
    
    const candidatesLines = dataString
      .split("\n")
      .filter((line) => line.trim());
    
    logger.debug({ totalLines: candidatesLines.length }, "Processing candidate lines");
    
    this.validateHeader(candidatesLines[0]);

    const candidates = candidatesLines.slice(1).map((line, index) => {
      const [vacancyId, id, ...modules] = line
        .split(",")
        .map((field) => field.trim());

      logger.debug({ candidateId: id, vacancyId, moduleCount: modules.length }, "Processing candidate");
      
      this.validateId(vacancyId);
      this.validateId(id);
      
      let validModuleLength = 0;
      const validModuleScoresSum = modules.reduce((acc: number, module) => {
        this.validateModuleScore(module);
        if (module.toUpperCase() !== "X") {
          validModuleLength = validModuleLength + 1;
          return acc + parseFloat(module);
        }
        return acc;
      }, 0);

      const averageScore = Math.round(validModuleScoresSum / validModuleLength);
      logger.debug(
        { 
          candidateId: id, 
          validModules: validModuleLength,
          averageScore 
        }, 
        "Calculated candidate average score"
      );

      return {
        id,
        vacancyId,
        averageModuleScores: averageScore,
        applicationOrder: index++,
      };
    });

    logger.info(
      { 
        totalCandidates: candidates.length 
      }, 
      "Completed parsing candidates data"
    );
    
    return candidates;
  }
}
