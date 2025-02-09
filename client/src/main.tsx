import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import "./index.css";
import { CandidateMatcher } from "./containers/candidate-matcher/candidate-matcher";
import { ErrorFallback } from "./components/error-fallback/error-fallback";
import { ErrorBoundary } from "react-error-boundary";
import { ErrorInfo } from "react";
import logger from "react-logger";
import { store } from "./store/store";

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

export const App = () => {
  return (
    <Provider store={store}>
      <ErrorBoundary
        FallbackComponent={(props) => (
          <ErrorFallback {...props} isDevelopment={isDevelopment} />
        )}
        onError={logError}
      >
        <CandidateMatcher />
      </ErrorBoundary>
    </Provider>
  );
};

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
