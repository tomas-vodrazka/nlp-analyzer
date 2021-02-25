import React from "react";
import _ from "lodash";
import { ConfusionMatrixForIntent } from "./ConfusionMatrixForIntent";

interface Props {
  confusionMatrix: {
    [key: string]: {
      [key: string]: number;
    };
  };
}

export const ConfusionMatrix: React.FC<Props> = ({ confusionMatrix }) => {
  return (
    <div>
      {Object.keys(confusionMatrix).map((intent) => {
        const res = confusionMatrix[intent];
        const accuracy = (res.total - (res.None ?? 0)) / res.total;
        return (
          <div key={intent}>
            <strong>
              {_.round(accuracy, 2) * 100}% | {intent}
            </strong>
            <ConfusionMatrixForIntent intentResults={res} />
          </div>
        );
      })}
    </div>
  );
};
