import { useState } from "react";
import _ from "lodash";
import { TestResult } from "./api/nlpModelTestService";
import { DEFUALT_NLP_PAIRS } from "../src/modelService";
import { ModelTestResult } from "../src/ModelResult";
import { ResultsOverview } from "../src/ResultsOverview";

export default function Home() {
  const [nlpPairs, setNlpPairs] = useState<string>(
    JSON.stringify(DEFUALT_NLP_PAIRS)
  );
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  return (
    <div>
      <h1>Model testing</h1>
      <textarea
        value={nlpPairs}
        onChange={(e) => {
          setNlpPairs(e.target.value);
        }}
      />
      <br />
      <button
        onClick={async () => {
          const res = await fetch("api/model", {
            method: "POST",
            body: nlpPairs,
          });
          const parsed = await res.json();
          setTestResults(parsed.testResults);
        }}
      >
        Test
      </button>
      {testResults.length > 0 && (
        <div>
          <h2>
            AVG: {_.meanBy(testResults, (testResult) => testResult.accuracy)}
          </h2>
          <ResultsOverview
            testResults={testResults}
            intentsList={JSON.parse(nlpPairs).map((pair) => pair.id)}
          />
          {testResults.map((testResult) => (
            <ModelTestResult testResult={testResult} />
          ))}
        </div>
      )}
    </div>
  );
}
