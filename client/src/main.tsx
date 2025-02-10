import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { CandidateMatcher } from "./containers/candidate-matcher/candidate-matcher";
import { ErrorFallback } from "./components/error-fallback/error-fallback";
import { ErrorBoundary } from "react-error-boundary";
import { ErrorInfo } from "react";
import { logger } from "./utils/logger";

logger.info({
  message: "Application starting",
  timestamp: new Date().toISOString(),
  environment: import.meta.env.MODE,
  apiUrl: import.meta.env.VITE_API_URL,
});

const logError = (error: Error, info: ErrorInfo) => {
  logger.error({
    message: "React Error Boundary caught an error",
    error,
    componentStack: info.componentStack || undefined,
    timestamp: new Date().toISOString(),
  });
};

const isDevelopment = import.meta.env.DEV;

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary
      FallbackComponent={(props) => (
        <ErrorFallback {...props} isDevelopment={isDevelopment} />
      )}
      onError={logError}
    >
      <CandidateMatcher />
    </ErrorBoundary>
  </StrictMode>
);
