import { useState } from "react";
import _ from "lodash";
import { DEFUALT_NLP_MODEL } from "../src/entity-replace/nlpModelService";

interface ValidatedInput {
  input: string;
  intent: string;
}

export default function Classify() {
  const [nlpModel, setNlpModel] = useState<string>(
    JSON.stringify(DEFUALT_NLP_MODEL)
  );
  const [textInputs, setTextInputs] = useState<string>("");
  const [showInputs, setShowInputs] = useState<boolean>(true);
  const [validatedInputs, setValidatedInputs] = useState<ValidatedInput[]>([]);
  return (
    <div>
      <h1>Text inputs classification</h1>
      <textarea
        value={nlpModel}
        onChange={(e) => {
          setNlpModel(e.target.value);
        }}
      />
      <br />
      <textarea
        value={textInputs}
        onChange={(e) => {
          setTextInputs(e.target.value);
        }}
      />
      <br />
      <button
        onClick={async () => {
          setValidatedInputs([]);
          const inputs = textInputs.split("\n");
          const model = JSON.parse(nlpModel);
          const res = await fetch("api/classify", {
            method: "POST",
            body: JSON.stringify({
              model,
              inputs,
            }),
          });
          const parsed = await res.json();
          setValidatedInputs(parsed.classified);
        }}
      >
        Classify
      </button>
      <button
        onClick={() => {
          setShowInputs(!showInputs);
        }}
      >
        Toggle inputs
      </button>
      <br />
      {validatedInputs?.length > 0 && (
        <>
          <h2>Results</h2>
          <table>
            <thead>
              <tr>
                {showInputs && <th>Input</th>}
                <th>Intent</th>
              </tr>
            </thead>
            <tbody>
              {validatedInputs.map((input) => {
                return (
                  <tr>
                    {showInputs && <td>{input.input}</td>}
                    <td>{input.intent}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}
