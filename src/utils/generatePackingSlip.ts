// Import the pdfmake library
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

// Define the PDF document structure
export function generatePackingSlip() {
  console.log("\n\n\n\n\n\n\n\n\n\n we're gettin called \n\n\n\n\n\n\n\n\n");

  const docDefinition = {
    content: [
      { text: "Hello, PDF!", style: "header" },
      "This is an example of a PDF generated using TypeScript and pdfmake.",
    ],
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
