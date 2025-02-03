import express, { Express, Request, Response } from "express";
import cors from "cors";
import candidateMatcherRoute from "./routes/candidate-matcher.route";
import config from "./config";
import logger from "./utils/logger";

const app: Express = express();

// Middleware
app.use(cors({
  origin: config.cors.origin
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check route
app.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({ status: "ok", message: "Server is running" });
});

// Routes
app.use("/api", candidateMatcherRoute);

// Start server
app.listen(config.port, () => {
  logger.info(
    {
      port: config.port,
      env: process.env.NODE_ENV || 'development',
      cors: config.cors.origin
    },
    "Server started successfully"
  );
});
