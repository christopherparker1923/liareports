/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import type { PartTags, PartTypes } from "@prisma/client";
import { readFileSync } from "fs";
import type { NextApiRequest, NextApiResponse } from "next";
import Papa from "papaparse";
import { prisma } from "../../server/db";

function importCSV() {
  // Read the CSV file
  const file = readFileSync("./src/pages/api/Parts_Data.csv", "utf8");

  Papa.parse(file, {
    complete: function ({ data }: { data: string[][] }) {
      Promise.all(
        data.slice(1, -1).map((row) => {
          if (row[1] === undefined) return;
          const part = {
            CSACert: !!row[6],
            partNumber: row[1]!,
            partType: row[2]?.trim() as PartTypes,
            preference: parseInt(row[8] || "0"),
            ULCert: !!row[7],
            description: row[9]!,
            partTags:
              row[10] && row[10]?.length > 0
                ? {
                    connectOrCreate: {
                      create: {
                        name: row[10]!.trim() as PartTags,
                      },
                      where: {
                        name: row[10] as PartTags,
                      },
                    },
                  }
                : {},
            Manufacturer: {
              connectOrCreate: {
                create: {
                  name: row[0]!,
                },
                where: {
                  name: row[0]!,
                },
              },
            },
          };
          return prisma.manufacturerPart.upsert({
            create: part,
            update: part,
            where: {
              manufacturerName_partNumber: {
                manufacturerName: row[0]!,
                partNumber: row[1]!,
              },
            },
          });
        })
      ).catch((e) => console.error(e));
    },
  });
}
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  importCSV();
  res.status(200).json({ name: "John Doe" });
}
