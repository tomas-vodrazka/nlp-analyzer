import { useState } from "react";
import _ from "lodash";
import styles from "../styles/Home.module.css";

export default function Home() {
  const [nlpPairs, setNlpPairs] = useState<string>("");
  const [accuracies, setAccuracies] = useState<number[]>([]);
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
          setAccuracies(parsed.accuracies);
        }}
      >
        Test
      </button>
      <div>
        AVG: <strong>{_.mean(accuracies)}</strong>
        {accuracies.map((acc) => (
          <div key={acc}>{acc}</div>
        ))}
      </div>
    </div>
  );
}
