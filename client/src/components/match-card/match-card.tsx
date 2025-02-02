import React from "react";
import clsx from "clsx";
import { VacancyMatch } from "../../types";

interface MatchCardProps {
  match: VacancyMatch;
}

export const MatchCard: React.FC<MatchCardProps> = ({ match }) => {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h3 className={styles.title}>Vacancy: {match.vacancyId}</h3>
        <div className={styles.hiringLimit}>
          Hiring Limit: <span className="font-bold">{match.hiringLimit}</span>
        </div>
      </div>

      <div className={styles.candidates}>
        {match.candidates.map((candidate, index) => (
          <div key={index} className={styles.candidate}>
            <div className={styles.candidateHeader}>
              <span className={styles.candidateId}>
                Candidate: {candidate.candidateId}
              </span>
              <span className={styles.score}>
                Average Score:{" "}
                <span className="font-bold">
                  {candidate.averageScore.toFixed(2)}%
                </span>
              </span>
            </div>

            <div className={styles.moduleScores}>
              <h4 className={styles.moduleTitle}>Module Scores</h4>
              <div className={styles.scoreGrid}>
                {candidate.moduleScores.map((score, idx) => (
                  <div key={idx} className={styles.moduleScore}>
                    <span className={styles.moduleName}>Module {idx + 1}</span>
                    <span
                      className={clsx(styles.scoreValue, {
                        [styles.noScore]: score === null,
                      })}
                    >
                      {score !== null ? score.toFixed(2) : "N/A"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
