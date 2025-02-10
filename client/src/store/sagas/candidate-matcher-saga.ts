import { call, put, takeLatest } from "redux-saga/effects";
import { PayloadAction } from "@reduxjs/toolkit";
import { api } from "../../api";
import {
  uploadFileRequest,
  uploadFileSuccess,
  uploadFileFailure,
  FileUploadPayload,
} from "../slices/candidate-matcher-slice";
import { MatchOutput } from "../../types";

function* handleFileUpload(action: PayloadAction<FileUploadPayload>) {
  try {
    const fileData = action.payload;

    // Validate file
    if (!fileData.name.toLowerCase().endsWith(".txt")) {
      throw new Error("Please upload a valid .txt file");
    }

    if (fileData.size === 0 || !fileData.content.trim()) {
      throw new Error("The file is empty");
    }

    // Create a new File object from the content
    const file = new File([fileData.content], fileData.name, {
      type: fileData.type,
    });

    // Prepare and send API request
    const formData = new FormData();
    formData.append("file", file);
    const results: MatchOutput[] = yield call(api, formData);

    yield put(uploadFileSuccess(results));
  } catch (error) {
    yield put(
      uploadFileFailure(
        error instanceof Error ? error.message : "An error occurred"
      )
    );
  }
}

export function* candidateMatcherSaga() {
  yield takeLatest(uploadFileRequest.type, handleFileUpload);
}
