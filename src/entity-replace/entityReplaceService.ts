import { NLPIntent, NLPModel } from "./types";

export function replaceEntities(nlpModel: NLPModel): NLPModel {
  const entitiesByIds = nlpModel.entities.reduce((prev, entity) => {
    const examples = entity.options.reduce((prev, example) => {
      return [...prev, ...example.examples];
    }, []);
    prev[`{${entity.id}}`] = examples;
    return prev;
  }, {});
  console.log(entitiesByIds);
  const replacedIntents = nlpModel.intents.map((intent) =>
    repalceIntent(intent, entitiesByIds)
  );

  return {
    ...nlpModel,
    intents: replacedIntents,
  };
}

export function repalceIntent(
  intent: NLPIntent,
  entitiesByIds: { [key: string]: string[] }
): NLPIntent {
  if (!intent.utterances) {
    return intent;
  }

  const replaceUntterences = [];
  intent.utterances.forEach((utterance) => {
    const founds = utterance.match(/\{[a-z0-9-]+\}/gi);
    console.log(utterance, founds);
    if (founds && founds.length === 1) {
      const examples = entitiesByIds[founds[0]];
      if (examples && examples.length > 0) {
        examples.forEach((example) => {
          console.log(`Replacing ${founds[0]} with ${example}`);
          replaceUntterences.push(utterance.replaceAll(founds[0], example));
        });
      } else {
        replaceUntterences.push(utterance);
      }
    } else {
      replaceUntterences.push(utterance);
    }
  });
  return {
    ...intent,
    utterances: replaceUntterences,
  };
}
