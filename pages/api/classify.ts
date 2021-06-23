// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { trainModel, createNlpManager } from "./nlpModelTestService";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { model, inputs } = JSON.parse(req.body);
  const train = [];
  console.log(model.inputs);
  model.intents.forEach((nlpPair) => {
    if (!nlpPair.utterances) {
      return;
    }
    nlpPair.utterances.forEach((utterance) => {
      train.push({
        id: nlpPair.id,
        utterance,
      });
    });
  });

  const trainedModel = await trainModel(createNlpManager(), train);
  const classified = [];
  for await (let input of inputs) {
    const intent = await trainedModel.process("cs", input);
    classified.push({
      input,
      intent: intent.intent,
    });
  }

  res.statusCode = 200;
  res.json({ classified });
};
