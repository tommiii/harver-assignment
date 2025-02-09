import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { MatchOutput } from '../../types';

interface CandidateMatcherState {
  matches: MatchOutput[];
  error: string | null;
  isLoading: boolean;
}

const initialState: CandidateMatcherState = {
  matches: [],
  error: null,
  isLoading: false,
};

export const candidateMatcherSlice = createSlice({
  name: 'candidateMatcher',
  initialState,
  reducers: {
    uploadFileRequest: (state, action: PayloadAction<File>) => {
      state.isLoading = true;
      state.error = null;
      state.matches = [];
    },
    uploadFileSuccess: (state, action: PayloadAction<MatchOutput[]>) => {
      state.isLoading = false;
      state.matches = action.payload;
    },
    uploadFileFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearMatches: (state) => {
      state.matches = [];
    },
  },
});

export const {
  uploadFileRequest,
  uploadFileSuccess,
  uploadFileFailure,
  clearError,
  clearMatches,
} = candidateMatcherSlice.actions;

export default candidateMatcherSlice.reducer; 