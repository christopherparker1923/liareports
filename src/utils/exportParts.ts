import Papa from "papaparse";
import { api } from "./api";
import { ManufacturerPart } from "@prisma/client";

const ExportParts = (data: ManufacturerPart[]) => {
  try {
    const csv = Papa.unparse(data, {});
    const csvFull = "data:text/csv;charset=utf-8," + csv;
    const encodedUri = encodeURI(csvFull);
    const link = document.createElement("a");
    link.setAttribute(
      "href",
      encodedUri
    );
    link.setAttribute("download", "parts.csv");
    // Trigger a click event on the anchor element to start the download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error("Error exporting to CSV:", error);
  }
};


export default ExportParts;
