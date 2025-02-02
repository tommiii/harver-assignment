import { MatchOutput, Candidate } from "../types";

export const getMatchString = (matchOutput: MatchOutput[]) => {
  return ["VacancyId,CandidateId,Overall Score"]
    .concat(
      matchOutput.flatMap((match) => {
        return match.candidates.map((candidate: Candidate) => {
          return `${match.vacancyId},${candidate.id},${candidate.averageModuleScores}`;
        });
      })
    )
    .join("\n");
};

export const downloadFileFromString = (input: string) => {
  const blob = new Blob([input], { type: "text/txt" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "output.txt";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
