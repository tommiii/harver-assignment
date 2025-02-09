import { all } from 'redux-saga/effects';
import { candidateMatcherSaga } from './sagas/candidateMatcherSaga';

// Import your sagas here when you create them
// import { matchSaga } from './sagas/matchSaga';

export function* rootSaga() {
  yield all([
    candidateMatcherSaga(),
    // Add your sagas here
    // matchSaga(),
  ]);
} 