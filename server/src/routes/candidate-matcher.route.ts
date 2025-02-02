import multer from "multer";
import { CandidateMatcherController } from "../controllers/candidate-matcher.controller";
import { Router } from "express";

const router = Router();

const candidateMatcherController = new CandidateMatcherController();

import { Request, Response } from "express";

router.post(
  "/match-engine",
  multer().single("file"),
  (req: Request, res: Response) => {
    candidateMatcherController.match(req, res);
  }
);

export default router;
