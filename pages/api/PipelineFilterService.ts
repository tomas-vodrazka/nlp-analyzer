import { NlpManager } from "node-nlp";

export async function filterText(text: string): Promise<string[]> {
  const manager = new NlpManager({
    languages: ["cs"],
    nlu: {
      keepStopwords: false,
      spellCheck: true,
    },
    keepStopwords: false,
    ner: { builtins: [] },
    autoSave: false,
    autoLoad: false,
    threshold: 0.7,
  });

  const filteredObj = await manager.nlp.nluManager.domainManagers.cs.prepare(
    text
  );
  return Object.keys(filteredObj);
}
