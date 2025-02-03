import { Request, Response } from "express";
import { MatchEngineService } from "../services/match-engine.service";

export class CandidateMatcherController {
  private matchEngineService;

  constructor() {
    this.matchEngineService = new MatchEngineService();
  }
  match(req: Request, res: Response) {
    try {
      const { file } = req;

      if (!file) {
        return res.status(400).json({ error: "No file provided" });
      }

      const dataString = file.buffer.toString("utf-8");

      const results = this.matchEngineService.match(dataString);

      res.json({ results });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: "Internal server error" });
      }
    }
  }
}
