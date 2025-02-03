import { MAX_HIRING_LIMIT, OBJECT_ID_REGEX } from "../constants";
import { Vacancy } from "../types";
import logger from "../utils/logger";

export class VacanciesService {
  private validateId(id: string): void {
    if (!OBJECT_ID_REGEX.test(id)) {
      logger.warn({ id }, "Invalid vacancy ObjectId format detected");
      throw new Error(`Invalid 'Vacancy Id': ${id} is not a valid ObjectId`);
    }
  }

  private validateHiringLimit(limit: number, vacancyId: string): void {
    if (isNaN(limit) || !Number.isInteger(limit)) {
      logger.warn({ limit, vacancyId }, "Invalid hiring limit format detected");
      throw new Error(
        `Invalid hiring limit for vacancy ${vacancyId}: must be an integer`
      );
    }
    if (limit < 0 || limit > MAX_HIRING_LIMIT) {
      logger.warn({ limit, maxLimit: MAX_HIRING_LIMIT, vacancyId }, "Hiring limit out of valid range");
      throw new Error(`Hiring limit must be between 0 and ${MAX_HIRING_LIMIT}`);
    }
  }

  private validateHeader(vacancyHeaderString: string): void {
    const vacancyHeaders = vacancyHeaderString
      .split(",")
      .map((header) => header.trim());

    logger.debug({ headers: vacancyHeaders }, "Validating vacancy headers");

    if (vacancyHeaders.length !== 2) {
      logger.warn({ headerLength: vacancyHeaders.length }, "Invalid vacancy header length");
      throw new Error(`Invalid Vacancy header: length must be 2`);
    }

    if (vacancyHeaders[0] !== "Vacancy Id") {
      logger.warn({ firstHeader: vacancyHeaders[0] }, "Missing Vacancy Id header");
      throw new Error(`Invalid Vacancy header: 'Vacancy Id' not found`);
    }

    if (vacancyHeaders[1] !== "Hiring Limit") {
      logger.warn({ secondHeader: vacancyHeaders[1] }, "Missing Hiring Limit header");
      throw new Error(`Invalid Vacancy header: 'Hiring Limit' not found`);
    }

    logger.debug("Vacancy header validation successful");
  }

  public parserVacanciesFromString(dataString: string): Vacancy[] {
    logger.info("Starting to parse vacancies data");
    
    const vacancyLines = dataString.split("\n").filter((line) => line.trim());
    logger.debug({ totalLines: vacancyLines.length }, "Processing vacancy lines");
    
    this.validateHeader(vacancyLines[0]);

    const vacancies = vacancyLines.slice(1).map((line) => {
      const [vacancyId, hiringLimit] = line
        .split(",")
        .map((field) => field.trim());

      logger.debug({ vacancyId, hiringLimit }, "Processing vacancy");
      
      this.validateId(vacancyId);
      this.validateHiringLimit(parseInt(hiringLimit), vacancyId);
      
      return {
        id: vacancyId,
        hiringLimit: parseInt(hiringLimit),
      };
    });

    logger.info(
      { totalVacancies: vacancies.length }, 
      "Completed parsing vacancies data"
    );
    
    return vacancies;
  }
}
