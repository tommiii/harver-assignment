import { combineReducers } from '@reduxjs/toolkit';
import candidateMatcherReducer from './slices/candidateMatcherSlice';

// Import your reducers here when you create them
// import { matchReducer } from './slices/matchSlice';

export const rootReducer = combineReducers({
  // Add your reducers here
  // match: matchReducer,
  candidateMatcher: candidateMatcherReducer,
}); 