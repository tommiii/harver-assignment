import { combineReducers } from "@reduxjs/toolkit";
import candidate_matcher_reducer from "./slices/candidate_matcher_slice";

export const root_reducer = combineReducers({
  candidate_matcher: candidate_matcher_reducer,
});
