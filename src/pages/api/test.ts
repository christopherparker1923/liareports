import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../server/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  let prom = await prisma.manufacturerPart.deleteMany({
    where: {
      id: "clf20541u0002toacuxcjds31",
    }
  }).catch((e) => console.error(e));

  console.log(prom);

  res.status(200).json({ name: "John Doe" });
}
