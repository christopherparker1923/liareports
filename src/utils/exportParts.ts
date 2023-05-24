import Papa from "papaparse";
import { api } from "./api";
import { ManufacturerPart } from "@prisma/client";

const ExportParts = (data: ManufacturerPart[]) => {
  console.log("Export Call");
  console.log("inExportCall: ", data);
  try {
    const csv = Papa.unparse(data, { skipEmptyLines: false });
    const link = document.createElement("a");
    link.setAttribute(
      "href",
      URL.createObjectURL(new Blob([csv], { type: "text/csv" }))
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
