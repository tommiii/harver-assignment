import { call, put, takeLatest } from 'redux-saga/effects';
import { PayloadAction } from '@reduxjs/toolkit';
import { api } from '../../api';
import {
  uploadFileRequest,
  uploadFileSuccess,
  uploadFileFailure,
} from '../slices/candidateMatcherSlice';
import { MatchOutput } from '../../types';

function* handleFileUpload(action: PayloadAction<File>) {
  try {
    const file = action.payload;
    
    // Validate file
    if (!file.name.toLowerCase().endsWith('.txt')) {
      throw new Error('Please upload a valid .txt file');
    }

    if (file.size === 0) {
      throw new Error('The file is empty');
    }

    // Read file content
    const fileContent: string = yield call([file, 'text']);
    if (!fileContent.trim()) {
      throw new Error('The file is empty');
    }

    // Prepare and send API request
    const formData = new FormData();
    formData.append('file', file);
    const results: MatchOutput[] = yield call(api, formData);
    
    yield put(uploadFileSuccess(results));
  } catch (error) {
    yield put(uploadFileFailure(error instanceof Error ? error.message : 'An error occurred'));
  }
}

export function* candidateMatcherSaga() {
  yield takeLatest(uploadFileRequest.type, handleFileUpload);
} 