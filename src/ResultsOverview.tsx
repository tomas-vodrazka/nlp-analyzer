import React, { useState } from "react";
import _ from "lodash";
import { TestResult } from "../pages/api/nlpModelTestService";
import { IntentResults } from "./IntentResults";

interface Props {
  testResults: TestResult[];
  intentsList: string[];
}

export const ResultsOverview: React.FC<Props> = ({
  testResults,
  intentsList,
}) => {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="results-overview">
      <button onClick={() => setShowDetails(!showDetails)}>
        Toggle details
      </button>
      <table>
        <tr>
          <th>Runs</th>
          {testResults.map((testResult) => (
            <td>
              <strong>{_.round(testResult.accuracy, 2) * 100}%</strong>
            </td>
          ))}
          <td className="final-avg">
            <strong>
              {_.round(
                _.meanBy(testResults, (testResult) => testResult.accuracy),
                2
              ) * 100}
              %
            </strong>
          </td>
        </tr>
        {intentsList.map((intent) => {
          let totalCount = 0;
          let totalCorrect = 0;

          return (
            <tr>
              <th>{intent}</th>
              {testResults.map((result) => {
                const intentResult = result.confusionMatrix[intent];
                const correct = intentResult[intent] ?? 0;
                const accuracy = correct / intentResult.total;
                totalCount += intentResult.total;
                totalCorrect += correct;
                return (
                  <td>
                    {_.round(accuracy * 100)}%
                    {showDetails && (
                      <IntentResults intentResults={intentResult} />
                    )}
                  </td>
                );
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
