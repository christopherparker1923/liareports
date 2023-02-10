// Import the pdfmake library
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

// Define the PDF document structure
export function generatePackingSlip(
  parts: string[],
  descriptions: string[],
  qty: number[]
) {
  console.log("\n\n\n\n\n\n\n\n\n\n we're gettin called \n\n\n\n\n\n\n\n\n");
  const content = parts.map((part, index) => {
    return {
      text: `${part} - ${descriptions[index] || "ERROR"} - ${
        qty[index] || "ERROR"
      }`,
    };
  });

  const docDefinition = {
    content,
    styles: {
      header: {
        fontSize: 18,
        bold: true,
      },
    },
  };

  // Generate the PDF
  pdfMake.createPdf(docDefinition).download();
}
