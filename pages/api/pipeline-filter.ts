// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { filterText } from "./PipelineFilterService";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const filteredText = await filterText(req.body);
  res.statusCode = 200;
  res.json({ filteredText });
};
