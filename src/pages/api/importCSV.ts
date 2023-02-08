import type { NextApiRequest, NextApiResponse } from "next";
import Papa from "papaparse";

function importCSV() {
  // Read the CSV file
  Papa.parse("./Parts_Data.csv", {
    complete: function (results) {
      console.log(results);
    },
  });
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  importCSV();
  res.status(200).json({ name: "John Doe" });
}
