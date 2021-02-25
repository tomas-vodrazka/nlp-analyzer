// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { crossValidateManager } from "./nlpModelTestService";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const accuracies = await crossValidateManager(4, JSON.parse(req.body));
  res.statusCode = 200;
  res.json({ accuracies });
};
