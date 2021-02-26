import React from "react";

interface Props {
  intentResults: {
    [key: string]: number;
  };
}

export const IntentResults: React.FC<Props> = ({ intentResults }) => {
  return (
    <p>
      {Object.keys(intentResults).map((result) => {
        return (
          <div className="result-miss" key={result}>
            {result}: {intentResults[result]}
          </div>
        );
      })}
    </p>
  );
};
