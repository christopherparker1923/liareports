import { prisma } from "../../../server/db";
import { NextApiRequest, NextApiResponse } from "next";
import importCSV from "../importCSV";
import { readFileSync } from "fs";
import { api } from "../../../utils/api";
import Papa from "papaparse";
/*
* I suggest we do this client side, similar to how we do the Packing Slip/Purchase Order
* utils/generatePackingSlip.ts - as an example, excel instead of pdf, but similar idea
*/
async function exportParts() {
  const parts = await prisma.manufacturerPart.findMany();
  if (!parts) return "Error";
  const csv = Papa.unparse(parts);
  return csv;
  // const link = document.createElement("a");
  // link.setAttribute(
  //   "href",
  //   URL.createObjectURL(new Blob([csv], { type: "text/csv" }))
  // );
  // link.setAttribute("download", "people.csv");

  // // Trigger a click event on the anchor element to start the download
  // document.body.appendChild(link);
  // link.click();
  // document.body.removeChild(link);
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const parts = exportParts(); //.catch((e) => console.error(e));
  res.status(200).send(parts);
}
