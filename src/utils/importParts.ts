import Papa from "papaparse";
import { api } from "./api";
import { ManufacturerPart, PartTags, PartTypes } from "@prisma/client";
import { prisma } from "../server/db";

const ImportPartsUtil = (
  data: File
) => {
  console.log("Export Call: ", data);

  Papa.parse(data, {
    complete: function ({ data }: { data: string[][]; }) {
      data.slice(1, -1).map((row) => {
        //console.log(row);
        if (row[3] === undefined) return;
        const part = {
          partNumber: row[3]!,
          partType: row[4]?.trim() as PartTypes,
          length: parseInt(row[5] || ""),
          width: parseInt(row[6] || ""),
          height: parseInt(row[7] || ""),
          CSACert: Boolean(row[8]) || false,
          ULCert: Boolean(row[9]) || false,
          preference: parseInt(row[10] || "0"),
          description: row[11] || "",
          partTags: row[12]?.split(",") as PartTags[],
          Manufacturer: row[13]
        };
        return part;
      });
    },
  });
};

export default ImportPartsUtil;
