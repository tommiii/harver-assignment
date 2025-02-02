import React from "react";
import { MatchCard } from "../../components/match-card/match-card";
import { VacancyMatch } from "../../types";
import styles from "./candidate-matcher.module.css";

export const CandidateMatcher = () => {
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [matches, setMatches] = React.useState<VacancyMatch[]>([]);
  const [error, setError] = React.useState<string>("");
  const [isLoading, setIsLoading] = React.useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!selectedFile) {
      setError("Please select a file");
      return;
    }

    if (!selectedFile.name.toLowerCase().endsWith(".txt")) {
      setError("Please upload a valid .txt file");
      return;
    }

    if (selectedFile.size === 0) {
      setError("The file is empty");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const fileContent = await selectedFile.text();
      if (!fileContent.trim()) {
        throw new Error("The file is empty");
      }

      const response = await fetch("/api/match", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data: fileContent }),
      });

      const contentType = response.headers.get("content-type");
      if (!response.ok) {
        let errorMessage = "Failed to process file";
        if (contentType?.includes("application/json")) {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } else {
          errorMessage = await response.text();
        }
        throw new Error(errorMessage);
      }

      if (!contentType?.includes("application/json")) {
        throw new Error("Invalid response format from server");
      }

      const data = await response.json();
      setMatches(data.results);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div id="root" className={styles.container}>
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
                  onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
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
                    Processing...
                  </>
                ) : (
                  "Upload and Match"
                )}
              </button>
            </div>

            {error && (
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
            )}
          </form>
        </div>

        {matches.length > 0 && (
          <div className={styles.matchesContainer}>
            {matches.map((match, index) => (
              <MatchCard key={index} match={match} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
