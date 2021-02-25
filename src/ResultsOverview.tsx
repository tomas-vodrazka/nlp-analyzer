import React from "react";
import _ from "lodash";
import { TestResult } from "../pages/api/nlpModelTestService";

interface Props {
  testResults: TestResult[];
  intentsList: string[];
}

export const ResultsOverview: React.FC<Props> = ({
  testResults,
  intentsList,
}) => {
  return (
    <div>
      <table>
        {intentsList.map((intent) => {
          let totalCount = 0;
          let totalCorrect = 0;
          return (
            <tr>
              <th>{intent}</th>
              {testResults.map((result) => {
                const intentResult = result.confusionMatrix[intent];
                const correct = intentResult.total - (intentResult.None ?? 0);
                const accuracy = correct / intentResult.total;
                totalCount += intentResult.total;
                totalCorrect += correct;
                return <td>{_.round(accuracy * 100)}%</td>;
              })}
              <td>
                <strong>{_.round((totalCorrect / totalCount) * 100)}%</strong>
              </td>
            </tr>
          );
        })}
      </table>
    </div>
  );
};
