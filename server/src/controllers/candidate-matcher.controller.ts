import { Request, Response } from "express";
import { MatchEngineService } from "../services/match-engine.service";
import logger from "../utils/logger";

export class CandidateMatcherController {
  private matchEngineService;

  constructor() {
    this.matchEngineService = new MatchEngineService();
  }

  match(req: Request, res: Response) {
    try {
      const { file } = req;
      logger.info("Processing match request");

      if (!file) {
        logger.warn("No file provided in the request");
        return res.status(400).json({ error: "No file provided" });
      }

      const dataString = file.buffer.toString("utf-8");
      logger.debug({ fileSize: file.size }, "Processing candidate data file");

      const results = this.matchEngineService.match(dataString);
      logger.info({ matchCount: results.length }, "Match processing completed");

      res.json({ results });
    } catch (error) {
      if (error instanceof Error) {
        logger.error({ error: error.message }, "Error processing match request");
        res.status(400).json({ error: error.message });
      } else {
        logger.error({ error }, "Internal server error during match processing");
        res.status(500).json({ error: "Internal server error" });
      }
    }
  }
}
