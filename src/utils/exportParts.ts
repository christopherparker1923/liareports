import csv from "fast-csv";
import { date } from "zod";
import { prisma } from "../server/db";
import fs from "fs";

const ExportParts = () => {
  const handleExportClick = async () => {
    try {
      const data = await prisma.manufacturerPart.findMany(); // Replace "yourTableName" with the actual name of the table you want to export
      //let fs = require("fs");
      const currentDate = new Date().toISOString().split("T")[0];
      const csvStream = csv.format({ headers: true });
      csvStream.pipe(fs.createWriteStream(`Part_Export_${currentDate}`)); // Specify the desired filename

      data.forEach((row: any) => {
        csvStream.write(row);
      });

      csvStream.end();
    } catch (error) {
      console.error("Error exporting to CSV:", error);
    }
  };

  return "success";
};

export default ExportParts;
