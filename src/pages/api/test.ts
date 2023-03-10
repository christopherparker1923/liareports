import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../server/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // let prom = await prisma.manufacturerPart.deleteMany({
  //   where: {
  //     updatedAt: {
  //       gt: new Date("2023-03-09T00:00:00.000Z"),
  //     }
  //   }
  // }).catch((e) => console.error(e));

  // console.log(prom);

  res.status(200).json({ name: "John Doe" });
}
