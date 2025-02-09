import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { MatchCard } from "../../components/match-card/match-card";
import styles from "./candidate-matcher.module.css";
import { downloadFileFromString, getMatchString } from "../../utils";
import { RootState } from "../../store/store";
import { MatchOutput } from "../../types";
import {
  uploadFileRequest,
  uploadFileFailure,
  clearError,
  clearMatches,
} from "../../store/slices/candidateMatcherSlice";

const LoadingSpinner = () => (
  <svg
    className={styles.loadingIcon}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    ></circle>
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    ></path>
  </svg>
);

const ErrorMessage = ({ error }: { error: string }) => (
  <div className={styles.errorContainer}>
    <div className={styles.errorContent}>
      <div className={styles.errorIcon}>
        <svg
          className={styles.errorIconSvg}
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
            clipRule="evenodd"
          />
        </svg>
      </div>
      <div className={styles.errorMessage}>
        <h3 className={styles.errorText}>{error}</h3>
      </div>
    </div>
  </div>
);

export const CandidateMatcher = () => {
  const dispatch = useDispatch();
  const { matches, error, isLoading } = useSelector((state: RootState) => state.candidateMatcher);
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);

  const handleFileChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSelectedFile(file);
    dispatch(clearMatches());
    dispatch(clearError());
  }, [dispatch]);

  const handleSubmit = React.useCallback((event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedFile) {
      dispatch(uploadFileFailure("Please select a file"));
      return;
    }
    dispatch(uploadFileRequest(selectedFile));
  }, [dispatch, selectedFile]);

  const handleDownload = React.useCallback(() => {
    const matchString = getMatchString(matches);
    downloadFileFromString(matchString);
  }, [matches]);

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.header}>
          <h1 className={styles.title}>Candidate Matcher</h1>

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.inputGroup}>
              <label className={styles.fileInputLabel}>
                <span className={styles.srOnly}>Choose file</span>
                <input
                  type="file"
                  className={styles.fileInput}
                  onChange={handleFileChange}
                  accept=".txt"
                />
              </label>
              <button
                type="submit"
                disabled={isLoading}
                className={styles.submitButton}
              >
                {isLoading ? (
                  <>
                    <LoadingSpinner />
                    Processing...
                  </>
                ) : (
                  "Upload and Match"
                )}
              </button>
            </div>

            {error && <ErrorMessage error={error} />}
          </form>
        </div>

        {matches.length > 0 && (
          <div className={styles.matchesContainer}>
            <div className={styles.downloadContainer}>
              <button
                onClick={handleDownload}
                type="submit"
                disabled={isLoading}
                className={styles.submitButton}
              >
                Download Matches File (.txt)
              </button>
            </div>
            {matches.map((match: MatchOutput, index: number) => (
              <MatchCard key={index} match={match} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
