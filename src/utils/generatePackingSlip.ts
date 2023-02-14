// Import the pdfmake library
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import type { TDocumentDefinitions } from "pdfmake/interfaces";
import type { PackingSlipPart } from "../pages/dashboard/generate/packing-slip";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

// Define the PDF document structure
export async function generatePackingSlip(
  parts: PackingSlipPart[],
  customer = "",
  billingAdress = "",
  shippingAdress = "",
  orderDate = "",
  orderNumber = "",
  purchaseOrder = "",
  customerContact = "",
  postComment = "",
  watermark = "",
  watermarkColor = "shuttleGrey"
) {
  const getBase64FromUrl = async (url: string): Promise<string> => {
    const data = await fetch(url);
    const blob = await data.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = () => {
        const base64data = reader.result;
        resolve(base64data as string);
      };
      6;
    });
  };

  console.log(
    "\n\n\n\n\n\n\n\n\n\n we're packing a slip here boys \n\n\n\n\n\n\n\n\n"
  );

  const partsList = parts.map((part) => ({
    text: part.partNumber || "",
    description: part.description || "",
    orderQty: part.quantity || 0,
    shipQty: part.quantity || 0,
  }));

  function countQuantities(parts: typeof partsList) {
    let totalOrderQty = 0;
    let totalShipQty = 0;
    for (const part of parts) {
      totalOrderQty += part.orderQty;
      totalShipQty += part.shipQty;
    }
    return { totalOrderQty, totalShipQty };
  }

  const { totalOrderQty, totalShipQty } = countQuantities(partsList);

  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString();
  const colors = {
    rhino: "#252f4c",
    puertoRico: "#3cb8ad",
    neptune: "#77b4b5",
    shuttleGray: "#646879",
    blackSqueeze: "#eef6f8",
    santasGray: "#a4a7b7",
    powderBlue: "#b2e6e8",
    osloGray: "#81868c",
    towerGray: "#a8c0c4",
  };
  const textBlue = colors.puertoRico;
  const backgroundBlue = colors.rhino;
  const backgroundGrey = colors.osloGray;

  const body = [
    [
      {
        text: "ITEM #",
        fillColor: backgroundBlue,
        color: "white",
        border: [false, false, false, false],
      },
      {
        text: "DESCRIPTION",
        fillColor: backgroundBlue,
        alignment: "center",
        color: "white",
        border: [false, false, false, false],
      },
      {
        text: "ORDER QTY",
        fillColor: backgroundBlue,
        color: "white",
        border: [false, false, false, false],
      },
      {
        text: "SHIP QTY",
        fillColor: backgroundBlue,
        color: "white",
        border: [false, false, false, false],
      },
    ],
    ...partsList.map((part) => [
      {
        text: part.text,
      },
      {
        text: part.description,
        alignment: "center",
      },
      {
        text: part.orderQty,
      },
      {
        text: part.shipQty,
      },
    ]),
    [
      {
        text: "",
        border: [false, false, false, false],
      },
      {
        text: "Total:",
        alignment: "right",
        border: [false, false, false, false],
      },
      { text: totalOrderQty, border: [false, false, false, false] },
      { text: totalShipQty, border: [false, false, false, false] },
    ],
  ];

  const docDef: TDocumentDefinitions = {
    watermark: {
      text: watermark,
      fontSize: 40,
      angle: -45,
      color: watermarkColor,
      opacity: 0.2,
    },
    content: [
      {
        columns: [
          {
            image: await getBase64FromUrl(
              "/_next/image?url=%2Flogo_noname.png&w=3840&q=75"
            ),
            width: 60,
            fit: [60, 60],
            margin: [0, 0, 100, 0],
          },
          {
            width: "*",

            text: [
              {
                text: "Lineside Industrial Automation Inc.\n",
                style: "header",
              },
              {
                text: "PACKING SLIP",
                style: "coloredText",
                margin: [0, 100, 0, 0],
              },
            ],
          },
        ],
      },
      {
        canvas: [
          {
            type: "line",
            x1: 0,
            y1: 5,
            x2: 595 - 2 * 40,
            y2: 5,
            lineWidth: 2,
          },
        ],
      },
      {
        margin: [-5, 10, -5, 0],
        style: "infoText",
        table: {
          widths: ["auto", "*", "auto", "auto"],
          body: [
            [
              { text: "60 Ottawa St S", border: [false, false, false, false] },
              { text: "", border: [false, false, false, false] },
              { text: "Date:", border: [false, false, false, false] },
              { text: formattedDate, border: [true, true, true, true] },
            ],
            [
              {
                text: "Kitchener, ON, N2G 3R5",
                border: [false, false, false, false],
              },
              { text: "", border: [false, false, false, false] },
              { text: "Customer ID:", border: [false, false, false, false] },
              { text: customer, border: [true, true, true, true] },
            ],
            [
              {
                text: "Phone: 519-590-7769 519-504-7906",
                border: [false, false, false, false],
              },
              { text: "", border: [false, false, false, false] },
              { text: "", border: [false, false, false, false] },
              { text: "", border: [false, false, false, false] },
            ],
            [
              {
                text: "Website: www.linesideautomation.com",
                border: [false, false, false, false],
              },
              { text: "", border: [false, false, false, false] },
              { text: "", border: [false, false, false, false] },
              { text: "", border: [false, false, false, false] },
            ],
          ],
        },
      },
      {
        margin: [-5, 10, -5, 0],
        table: {
          heights: ["auto", 80, "auto", "auto", "auto", "auto", "auto"],
          headerRows: 1,
          widths: ["auto", "*", "auto", "*"],
          body: [
            [
              {
                text: "BILL TO:",
                fillColor: backgroundBlue,
                color: "white",
                border: [false, false, false, false],
              },
              { text: "", border: [false, false, false, false] },
              {
                text: "SHIP TO:",
                fillColor: backgroundBlue,
                color: "white",
                border: [false, false, false, false],
              },
              { text: "", border: [false, false, false, false] },
            ],
            [
              { text: billingAdress, border: [false, false, false, false] },
              { text: "", border: [false, false, false, false] },
              { text: shippingAdress, border: [false, false, false, false] },
              { text: "", border: [false, false, false, false] },
            ],
            [
              { text: "", border: [false, false, false, false] },
              { text: "", border: [false, false, false, false] },
              { text: "", border: [false, false, false, false] },
              { text: "", border: [false, false, false, false] },
            ],
            [
              {
                text: "ORDER DATE",
                fillColor: backgroundBlue,
                color: "white",
                border: [false, false, false, false],
              },
              {
                text: "ORDER #",
                fillColor: backgroundBlue,
                color: "white",
                border: [false, false, false, false],
              },
              {
                text: "PO #",
                fillColor: backgroundBlue,
                color: "white",
                border: [false, false, false, false],
              },
              {
                text: "CUSTOMER CONTACT",
                fillColor: backgroundBlue,
                color: "white",
                border: [false, false, false, false],
              },
            ],
            [
              { text: "", border: [false, false, false, false] },
              { text: "", border: [false, false, false, false] },
              { text: "", border: [false, false, false, false] },
              { text: "", border: [false, false, false, false] },
            ],
            [
              { text: orderDate, border: [false, false, false, false] },
              { text: orderNumber, border: [false, false, false, false] },
              { text: purchaseOrder, border: [false, false, false, false] },
              { text: customerContact, border: [false, false, false, false] },
            ],
            [
              { text: "", border: [false, false, false, false] },
              { text: "", border: [false, false, false, false] },
              { text: "", border: [false, false, false, false] },
              { text: "", border: [false, false, false, false] },
            ],
          ],
        },
      },
      {
        margin: [-5, 10, -5, 10],
        table: {
          headerRows: 1,
          widths: ["auto", "*", "auto", "auto"],
          body,
        },
      },

      {
        margin: [-5, 0, -5, 0],
        table: {
          widths: ["*"],
          heights: ["auto", 60, "auto", 60],
          body: [
            [
              {
                text: "COMMENTS:",
                fillColor: backgroundGrey,
                border: [true, true, true, false],
              },
            ],
            [
              {
                text: postComment,
                border: [true, false, true, true],
              },
            ],
            [
              {
                text: "CUSTOMER SIGNATURE:",
                fillColor: backgroundGrey,
                border: [true, true, true, false],
              },
            ],
            [
              {
                text: "",
                border: [true, false, true, true],
              },
            ],
          ],
        },
      },
    ],
    styles: {
      header: {
        fontSize: 22,
        bold: true,
        alignment: "right",
      },
      coloredText: {
        fontSize: 22,
        color: textBlue,
        alignment: "right",
      },
      infoText: {
        fontSize: 12,
      },
      basicText: {
        fontSize: 14,
      },
      blueBackground: {
        fontSize: 14,
        color: "white",
        background: backgroundBlue,
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
  pdfMake.createPdf(docDef).open();
}
