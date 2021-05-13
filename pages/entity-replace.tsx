import { useState } from "react";
import _ from "lodash";
import { TestResult } from "./api/nlpModelTestService";
import { DEFUALT_NLP_MODEL } from "../src/entity-replace/nlpModelService";
import { ResultsOverview } from "../src/ResultsOverview";
import { replaceEntities } from "../src/entity-replace/entityReplaceService";

export default function EntityReplace() {
  const [nlpModel, setNlpModel] = useState<string>(
    JSON.stringify(DEFUALT_NLP_MODEL)
  );
  const [replacedNlpModel, setReplacedNlpModel] = useState({});
  return (
    <div>
      <h1>Entity replace</h1>
      <textarea
        value={nlpModel}
        onChange={(e) => {
          setNlpModel(e.target.value);
        }}
      />
      <br />
      <button
        onClick={async () => {
          setReplacedNlpModel(replaceEntities(JSON.parse(nlpModel)));
        }}
      >
        Replace
      </button>
      <br />
      <textarea value={JSON.stringify(replacedNlpModel)} />
    </div>
  );
}
