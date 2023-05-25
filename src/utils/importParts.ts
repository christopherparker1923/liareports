import Papa from "papaparse";
import { api } from "./api";
import { ManufacturerPart, PartTags, PartTypes } from "@prisma/client";
import { prisma } from "../server/db";

const ImportPartsUtil = (data: File) => {
  console.log("Export Call: ", data);

  Papa.parse(data, {
    complete: function ({ data }: { data: string[][]; }) {
      console.log("Inside papa.parse");
      Promise.all(
        data.slice(1, -1).map((row) => {
          //console.log(row);
          if (row[1] === undefined) return;
          const part = {
            partNumber: row[3]!,
            partType: row[4]?.trim() as PartTypes,
            length: parseInt(row[5] || ""),
            width: parseInt(row[6] || ""),
            height: parseInt(row[7] || ""),
            CSACert: !!row[8],
            ULCert: !!row[9],
            preference: parseInt(row[10] || "0"),
            description: row[11]!,
            partTags:
              row[12] && row[12]?.length > 0
                ? {
                  connectOrCreate: {
                    create: {
                      name: row[12]!.trim() as PartTags,
                    },
                    where: {
                      name: row[12] as PartTags,
                    },
                  },
                }
                : {},
            Manufacturer: {
              connectOrCreate: {
                create: {
                  name: row[13]!,
                },
                where: {
                  name: row[13]!,
                },
              },
            },
          };
          console.log(part);

          return prisma.manufacturerPart.upsert({
            create: part,
            update: part,
            where: {
              id: row[0],
              // manufacturerName_partNumber: {
              //   manufacturerName: row[0]!,
              //   partNumber: row[1]!,
              // },
            },
          });
        })
      ).catch((error) => console.error("Error exporting to CSV:", error));
    },
  });
};

export default ImportPartsUtil;
