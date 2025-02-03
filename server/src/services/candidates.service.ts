import {
  MAX_DECIMAL_PLACES,
  MAX_MODULE_SCORE,
  MIN_MODULE_SCORE,
  OBJECT_ID_REGEX,
} from "../constants";
import { Candidate } from "../types";

export class CandidatesService {
  private validateId(id: string): void {
    if (!OBJECT_ID_REGEX.test(id)) {
      throw new Error(`Invalid 'Candidate Id': ${id} is not a valid ObjectId`);
    }
  }

  private validateModuleScore(score: string): void {
    if (score.toUpperCase() === "X") return;

    const numScore = parseFloat(score);
    if (isNaN(numScore)) {
      throw new Error(`Invalid score: ${score} is not a number or 'X'`);
    }

    if (numScore < MIN_MODULE_SCORE || numScore > MAX_MODULE_SCORE) {
      throw new Error(
        `Score must be between ${MIN_MODULE_SCORE} and ${MAX_MODULE_SCORE}`
      );
    }

    const decimalPlaces = score.includes(".") ? score.split(".")[1].length : 0;
    if (decimalPlaces > MAX_DECIMAL_PLACES) {
      throw new Error(
        `Score can have maximum ${MAX_DECIMAL_PLACES} decimal places`
      );
    }
  }

  private validateHeader(candidatesHeaderString: string): void {
    const candidatesHeaders = candidatesHeaderString
      .split(",")
      .map((header) => header.trim());

    if (candidatesHeaders.length < 2) {
      throw new Error(
        `Invalid Candidate header: length must be greater than 2`
      );
    }

    if (candidatesHeaders[0] !== "Vacancy Id") {
      throw new Error(`Invalid Candidate header: 'Vacancy Id' not found`);
    }

    if (candidatesHeaders[1] !== "Candidate Id") {
      throw new Error(`Invalid Candidate header: 'Candidate Id' not found`);
    }
  }

  public parserCandidatesFromString(dataString: string): Candidate[] {
    const candidatesLines = dataString
      .split("\n")
      .filter((line) => line.trim());
    this.validateHeader(candidatesLines[0]);

    const candidates = candidatesLines.slice(1).map((line, index) => {
      const [vacancyId, id, ...modules] = line
        .split(",")
        .map((field) => field.trim());
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

      return {
        id,
        vacancyId,
        averageModuleScores: Math.round(
          validModuleScoresSum / validModuleLength
        ),
        applicationOrder: index++,
      };
    });
    return candidates;
  }
}
