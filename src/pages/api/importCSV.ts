import { readFileSync } from "fs";
import type { NextApiRequest, NextApiResponse } from "next";
import Papa from "papaparse";
import { prisma } from "../../server/db";

function importCSV() {
  // Read the CSV file
  const file = readFileSync("./src/pages/api/Parts_Data.csv", "utf8");

  Papa.parse(file, {
    complete: async function (results) {
      //for await (row of results.data.slice(1))
      results.data.slice(1).forEach((row: any) => {
        if (row[10])
          prisma.manufacturerPart
            .upsert({
              create: {
                partNumber: row[1],
                CSACert: !!row[6],
                partType: row[2],
                preference: parseInt(row[8]),
                ULCert: !!row[7],
                description: row[9],
                Manufacturer: {
                  connectOrCreate: {
                    create: { name: row[0] },
                    where: { name: row[0] },
                  },
                },
                partTags: {
                  connectOrCreate: {
                    create: { name: row[10] },
                    where: { name: row[10] },
                  },
                },
              },
              update: {
                partNumber: row[1],
                CSACert: !!row[6],
                partType: row[2],
                preference: parseInt(row[8]),
                ULCert: !!row[7],
                description: row[9],
                Manufacturer: {
                  connectOrCreate: {
                    create: { name: row[0] },
                    where: { name: row[0] },
                  },
                },
                partTags: {
                  connectOrCreate: {
                    create: { name: row[10] },
                    where: { name: row[10] },
                  },
                },
              },
              where: {
                manufacturerName_partNumber: {
                  manufacturerName: row[0],
                  partNumber: row[1],
                },
              },
            })
            .catch((e) => console.log(e));
        else
          prisma.manufacturerPart
            .upsert({
              create: {
                partNumber: row[1],
                CSACert: !!row[6],
                partType: row[2],
                preference: parseInt(row[8]),
                ULCert: !!row[7],
                description: row[9],
                Manufacturer: {
                  connectOrCreate: {
                    create: { name: row[0] },
                    where: { name: row[0] },
                  },
                },
              },
              update: {
                partNumber: row[1],
                CSACert: !!row[6],
                partType: row[2],
                preference: parseInt(row[8]),
                ULCert: !!row[7],
                description: row[9],
                Manufacturer: {
                  connectOrCreate: {
                    create: { name: row[0] },
                    where: { name: row[0] },
                  },
                },
              },
              where: {
                manufacturerName_partNumber: {
                  manufacturerName: row[0],
                  partNumber: row[1],
                },
              },
            })
            .catch((e) => console.log(e));
      });

      console.log(results.data.slice(0, 2));
    },
  });
}
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  importCSV();
  res.status(200).json({ name: "John Doe" });
}
