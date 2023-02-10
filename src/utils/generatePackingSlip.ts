// Import the pdfmake library
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

// Define the PDF document structure
export function generatePackingSlip(
  parts: string[],
  descriptions: string[],
  qty: number[],
  customer: string,
  billingAdress: string,
  shippingAdress: string
) {
  console.log(
    "\n\n\n\n\n\n\n\n\n\n we're packing a slip here boys \n\n\n\n\n\n\n\n\n"
  );
  const partsList = parts.map((part, index) => {
    return {
      text: `${part} - ${descriptions[index] || "ERROR"} - ${
        qty[index] || "ERROR"
      }`,
    };
  });

  const currentDate = new Date();
  let formattedDate = currentDate.toLocaleDateString();

  const docDefinition = {
    content: [
      // {
      //   image: "/public/logo_noname.png",
      //   fit: [100, 100],
      // },
      {
        text: [
          {
            text: "Lineside Industrial Automation Inc.",
            style: "header",
          },
          {
            text: "       PACKING SLIP\n\n",
            style: "coloredText",
          },
          {
            text:
              "60 Ottawa St S                                                                 Date:        " +
              formattedDate +
              "\n",
            style: "basicText",
          },
          {
            text:
              "Kitchener, ON, N2G 3R5                                                  Customer ID: " +
              customer +
              "\n",
            style: "basicText",
          },
          {
            text: "Phone: 519-590-7769 519-504-7906\n\n",
            style: "basicText",
          },
        ],
      },
      {
        table: {
          headerRows: 1,
          widths: ["40%", "20%", "40%"],

          body: [
            ["BILL TO:", "", "SHIP TO:"],
            [billingAdress, "", shippingAdress],
          ],
        },
        style: "tableExample",
        layout: "headerLineOnly",
      },
      {
        table: {
          headerRows: 1,
          widths: ["*", "*", "*", "*"],

          body: [
            ["ORDER DATE", "ORDER #", "PURCHASE ORDER #", "CUSTOMER CONTACT"],
            [billingAdress, "", shippingAdress, "hello"],
          ],
        },
        style: "tableExample",
        layout: "headerLineOnly",
      },
      partsList,
    ],
    styles: {
      header: {
        fontSize: 18,
        bold: true,
      },
      coloredText: {
        fontSize: 22,
        color: "blue",
        alignment: "right",
      },
      basicText: {
        fontSize: 14,
      },
      blueBackground: {
        fontSize: 14,
        color: "white",
        background: "blue",
      },
      tableExample: {
        margin: [0, 5, 0, 15],
        fontSize: 10,
      },
      tableHeader: {
        bold: true,
        fontSize: 11,
        color: "black",
        background: "#e6e6e6",
      },
    },
  };

  // Generate the PDF
  pdfMake.createPdf(docDefinition).download();
}
