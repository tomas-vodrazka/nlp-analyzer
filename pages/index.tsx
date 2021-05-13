import { useState } from "react";
import styles from "../styles/Home.module.css";

export default function Home() {
  const [filteredText, setFilteredText] = useState<string[]>([]);
  const [textToFilter, setTextToFilter] = useState("");
  return (
    <div>
      <h2>Text processing pipeline</h2>
      <input
        type="text"
        onChange={(e) => {
          setTextToFilter(e.target.value);
        }}
      />
      <button
        onClick={async () => {
          const res = await fetch("api/pipeline-filter", {
            method: "POST",
            body: textToFilter,
          });
          const parsed = await res.json();
          setFilteredText(parsed.filteredText);
        }}
      >
        Filter
      </button>
      <div>{filteredText.join(", ")}</div>
    </div>
  );
}
