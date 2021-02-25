import React from "react";

interface Props {
  intentResults: {
    [key: string]: number;
  };
}

export const ConfusionMatrixForIntent: React.FC<Props> = ({
  intentResults,
}) => {
  return (
    <div>
      {Object.keys(intentResults).map((result) => {
        return (
          <div className="result-miss" key={result}>
            {result}: {intentResults[result]}
          </div>
        );
      })}
    </div>
  );
};
