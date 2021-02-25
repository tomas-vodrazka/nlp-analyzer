import React from "react";
import { TestResult } from "../pages/api/nlpModelTestService";
import { ConfusionMatrix } from "./ConfusionMatrix";

interface Props {
  testResult: TestResult;
}

export const ModelTestResult: React.FC<Props> = ({ testResult }) => {
  return (
    <div key={testResult.accuracy}>
      <h3>{testResult.accuracy}</h3>
      <ConfusionMatrix confusionMatrix={testResult.confusionMatrix} />
    </div>
  );
};
