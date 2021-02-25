import _ from "lodash";
import { NlpManager } from "node-nlp";

export interface NlpCase {
  utterance: string;
  id: string;
}

export interface NlpPair {
  id: string;
  utterances: string[];
}

export type Fold = NlpCase[];

function createNlpManager() {
  return new NlpManager({
    languages: ["cs"],
    nlu: {
      keepStopwords: false,
      spellCheck: true,
    },
    ner: { builtins: [] },
    autoSave: false,
    autoLoad: false,
    threshold: 0.7,
  });
}

export async function crossValidateManager(
  k: number,
  nlpPairs: NlpPair[]
): Promise<number[]> {
  const folds = splitToKFolds(k, nlpPairs);
  const results = await testFolds(folds);

  return results;
}

export function splitToKFolds(k: number, nlpPairs: NlpPair[]): Fold[] {
  const folds: Fold[] = [];

  let foldIndex = 0;

  nlpPairs.forEach((nlpPair) => {
    nlpPair.utterances.forEach((utterance) => {
      const i = foldIndex % k;
      if (!folds[i]) {
        folds[i] = [];
      }
      folds[i].push({
        id: nlpPair.id,
        utterance,
      });
      foldIndex += 1;
    });
  });

  return folds;
}

export function foldsToCases(folds: Fold[]): NlpCase[] {
  let cases: NlpCase[] = [];

  folds.forEach((fold) => {
    cases = _.concat(cases, fold);
  });

  return cases;
}

export async function getModelAccuracy(
  model: any,
  testCases: NlpCase[]
): Promise<number> {
  let correctAnswers = 0;

  for (let i = 0; i < testCases.length; i += 1) {
    const testCase = testCases[i];
    const predicted = await model.process("cs", testCase.utterance);
    const intent = predicted.intent;

    if (intent === testCase.id) {
      correctAnswers += 1;
    }
  }

  return correctAnswers / testCases.length;
}

export async function testFolds(folds: Fold[]): Promise<number[]> {
  const results: number[] = [];
  for (let i = 0; i < folds.length; i += 1) {
    const test = folds[i];
    const train = foldsToCases(_.without(folds, test));
    const model = await trainModel(createNlpManager(), train);
    const accuracy = await getModelAccuracy(model, test);
    results.push(accuracy);
  }

  return results;
}

export async function trainModel(manager: any, trainCases: NlpCase[]) {
  trainCases.forEach((trainCase) => {
    manager.addDocument("cs", trainCase.utterance, trainCase.id);
  });

  await manager.train();

  return manager;
}
