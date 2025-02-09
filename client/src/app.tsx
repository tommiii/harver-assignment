import { ErrorBoundary } from "react-error-boundary";
import { ErrorFallback } from "./components/error-fallback/error-fallback";
import { CandidateMatcher } from "./containers/candidate-matcher/candidate-matcher";
import { ErrorInfo } from "react";
import logger from "react-logger";

const logError = (error: Error, info: ErrorInfo) => {
  logger.error({
    message: "React Error Boundary caught an error",
    error,
    componentStack: info.componentStack || undefined,
    timestamp: new Date().toISOString(),
  });
};

const isDevelopment = import.meta.env.DEV;

export const App = () => {
  return (
    <ErrorBoundary
      FallbackComponent={(props) => (
        <ErrorFallback {...props} isDevelopment={isDevelopment} />
      )}
      onError={logError}
    >
      <CandidateMatcher />
    </ErrorBoundary>
  );
};
