import { CandidateMatcherController } from "../controllers/candidate-matcher.controller";
import { Router } from "express";

const router = Router();

const candidateMatcherController = new CandidateMatcherController();

import { Request, Response } from "express";

router.post("/candidate-matcher", (req: Request, res: Response) => {
  candidateMatcherController.matchCandidates(req, res);
});

export default router;
