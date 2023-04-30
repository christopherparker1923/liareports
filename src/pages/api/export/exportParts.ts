import { prisma } from "../../../server/db";
import { NextApiRequest, NextApiResponse } from "next";
import importCSV from "../importCSV";
import { readFileSync } from "fs";
import { api } from "../../../utils/api";
import Papa from "papaparse";

function exportParts() {
  const { data: parts } = api.parts.getAllParts.useQuery();
  if (!parts) return "Error";
  const csv = Papa.unparse(parts);

  const link = document.createElement("a");
  link.setAttribute(
    "href",
    URL.createObjectURL(new Blob([csv], { type: "text/csv" }))
  );
  link.setAttribute("download", "people.csv");

  // Trigger a click event on the anchor element to start the download
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  exportParts(); //.catch((e) => console.error(e));
  res.status(200).json({ name: "John Doe" });
}
