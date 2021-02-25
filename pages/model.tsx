import { useState } from "react";
import _ from "lodash";
import { TestResult } from "./api/nlpModelTestService";
import { DEFUALT_NLP_PAIRS } from "./modelService";
import { ModelTestResult } from "../src/ModelResult";

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
      <div>
        <h2>
          AVG: {_.meanBy(testResults, (testResult) => testResult.accuracy)}
        </h2>
        {testResults.map((testResult) => (
          <ModelTestResult testResult={testResult} />
        ))}
      </div>
    </div>
  );
}
