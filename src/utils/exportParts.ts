import Papa from "papaparse";
import type { ManufacturerPart, PartTag } from "@prisma/client";

const ExportParts = (
  data: (ManufacturerPart & {
    partTags: PartTag[];
  })[]
) => {
  try {
    const dataWithPartTags = data.map((part) => {
      return {
        ...part,
        partTags: part.partTags.map((tag) => tag.name).join(", "),
      };
    });
    const currentDate = new Date()?.toISOString()?.split("T")[0] || "";
    const csv = Papa.unparse(dataWithPartTags, { skipEmptyLines: false });
    const link = document.createElement("a");
    link.setAttribute(
      "href",
      URL.createObjectURL(new Blob([csv], { type: "text/csv" }))
    );
    link.setAttribute("download", `Export-Parts-${currentDate}.csv`);
    // Trigger a click event on the anchor element to start the download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error("Error exporting to CSV:", error);
  }
};

export default ExportParts;
