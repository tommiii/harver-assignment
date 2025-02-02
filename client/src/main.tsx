import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { CandidateMatcher } from "./containers/candidate-matcher/candidate-matcher";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <CandidateMatcher />
  </StrictMode>
);
