import { all } from "redux-saga/effects";
import { candidateMatcherSaga } from "./sagas/candidate-matcher-saga";

export function* rootSaga() {
  yield all([candidateMatcherSaga()]);
}
