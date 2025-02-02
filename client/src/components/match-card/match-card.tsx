import React from "react";
import { MatchOutput } from "../../types";

import styles from "./match-card.module.css";

interface MatchCardProps {
  match: MatchOutput;
}

export const MatchCard: React.FC<MatchCardProps> = ({ match }) => {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h3 className={styles.title}>Vacancy Id: {match.vacancyId}</h3>
        <div className={styles.hiringLimit}>
          Hiring Limit: <span className="font-bold">{match.hiringLimit}</span>
        </div>
      </div>

      <div className={styles.candidates}>
        {match.candidates.map((candidate, index) => (
          <div key={index} className={styles.candidate}>
            <div className={styles.candidateHeader}>
              <span className={styles.candidateId}>
                Candidate Id: {candidate.id}
              </span>
              <span className={styles.score}>
                Average Score:{" "}
                <span className="font-bold">
                  {candidate.averageModuleScores}%
                </span>
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
