import { combineReducers } from "@reduxjs/toolkit";
import candidateMatcherReducer from "./slices/candidate-matcher-slice";

export const rootReducer = combineReducers({
  candidateMatcher: candidateMatcherReducer,
});
