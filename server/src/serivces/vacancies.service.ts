import {
  MAX_DECIMAL_PLACES,
  MAX_HIRING_LIMIT,
  MAX_MODULE_SCORE,
  MIN_MODULE_SCORE,
  OBJECT_ID_REGEX,
} from "../constants";

import { Vacancy } from "../types";

export class VacanciesService {
  private validateId(id: string): void {
    if (!OBJECT_ID_REGEX.test(id)) {
      throw new Error(`Invalid 'Vacancy Id': ${id} is not a valid ObjectId`);
    }
  }

  private validateHiringLimit(limit: number, vacancyId: string): void {
    if (isNaN(limit) || !Number.isInteger(limit)) {
      throw new Error(
        `Invalid hiring limit for vacancy ${vacancyId}: must be an integer`
      );
    }
    if (limit < 0 || limit > MAX_HIRING_LIMIT) {
      throw new Error(`Hiring limit must be between 0 and ${MAX_HIRING_LIMIT}`);
    }
  }

  private validateHeader(vacancyHeaderString: string): void {
    const vacancyHeaders = vacancyHeaderString
      .split(",")
      .map((header) => header.trim());

    if (vacancyHeaders.length !== 2) {
      throw new Error(`Invalid Vacancy header: length must be 2`);
    }

    if (vacancyHeaders[0] !== "Vacancy Id") {
      throw new Error(`Invalid Vacancy header: 'Vacancy Id' not found`);
    }

    if (vacancyHeaders[1] !== "Hiring Limit") {
      throw new Error(`Invalid Vacancy header: 'Hiring Limit' not found`);
    }
  }

  public parserVacanciesFromString(dataString: string): Vacancy[] {
    const vacancyLines = dataString.split("\n").filter((line) => line.trim());
    this.validateHeader(vacancyLines[0]);
    const vacancies = vacancyLines.slice(1).map((line) => {
      const [vacancyId, hiringLimit] = line
        .split(",")
        .map((field) => field.trim());
      this.validateId(vacancyId);
      this.validateHiringLimit(parseInt(hiringLimit), vacancyId);
      return {
        id: vacancyId,
        hiringLimit: parseInt(hiringLimit),
      };
    });
    return vacancies;
  }
}
