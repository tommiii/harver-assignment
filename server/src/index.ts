import express, { Express, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import candidateMatcherRoute from "./routes/candidate-matcher.route";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check route
app.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({ status: "ok", message: "Server is running" });
});

// Routes
app.use("/api", candidateMatcherRoute);

// Start server
app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
