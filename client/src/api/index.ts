import config from "../config";
import { MatchOutput } from "../types";
import { logger } from "../utils/logger";

export const api = async (formData: FormData): Promise<MatchOutput[]> => {
  try {
    logger.info({ message: "Starting API request to match-engine" });
    const response = await fetch(`${config.apiUrl}/match-engine`, {
      method: "POST",
      body: formData,
    });

    const contentType = response.headers.get("content-type");
    if (!response.ok) {
      let errorMessage = "Failed to process file";
      if (contentType?.includes("application/json")) {
        const errorData = await response.json();
        errorMessage = errorData.error || errorMessage;
      } else {
        errorMessage = await response.text();
      }
      logger.error({
        message: "API request failed",
        error: errorMessage,
      });
      throw new Error(errorMessage);
    }

    if (!contentType?.includes("application/json")) {
      const errorMessage = "Invalid response format from server";
      logger.error({ 
        message: "Invalid response format", 
        error: errorMessage 
      });
      throw new Error(errorMessage);
    }

    logger.info({ message: "API request completed successfully" });
    const data = await response.json();
    return data.results;
  } catch (error) {
    const errorMessage = error instanceof Error 
      ? error.message 
      : "Network error occurred while processing the request";
      
    logger.error({ 
      message: "API request error", 
      error: errorMessage 
    });
    throw new Error(errorMessage);
  }
};
