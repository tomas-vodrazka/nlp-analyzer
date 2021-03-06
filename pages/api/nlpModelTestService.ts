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

export interface ConfusionMatrix {
  [key: string]: {
    total: number;
    [key: string]: number;
  };
}

export interface TestResult {
  accuracy: number;
  confusionMatrix: ConfusionMatrix;
}

export function createNlpManager() {
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
): Promise<TestResult[]> {
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
): Promise<TestResult> {
  let correctAnswers = 0;

  const confusionMatrix = {};

  for (let i = 0; i < testCases.length; i += 1) {
    const testCase = testCases[i];
    const predicted = await model.process("cs", testCase.utterance);
    const intent = predicted.intent;

    if (!confusionMatrix[testCase.id]) {
      confusionMatrix[testCase.id] = {
        total: 0,
      };
    }

    confusionMatrix[testCase.id].total += 1;

    if (!confusionMatrix[testCase.id][intent]) {
      confusionMatrix[testCase.id][intent] = 0;
    }

    confusionMatrix[testCase.id][intent] += 1;

    if (intent === testCase.id) {
      correctAnswers += 1;
    }
  }

  return { accuracy: correctAnswers / testCases.length, confusionMatrix };
}

export async function testFolds(folds: Fold[]): Promise<TestResult[]> {
  const results: TestResult[] = [];
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
