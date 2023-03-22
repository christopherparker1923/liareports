// Import the pdfmake library
import { Vendor } from "@prisma/client";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import type { TDocumentDefinitions } from "pdfmake/interfaces";
import type { PackingSlipPart } from "../pages/dashboard/generate/packing-slip";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

// Define the PDF document structure
export async function generatePurchaseOrder(
  parts: PackingSlipPart[],
  //   vendor: Vendor,
  customer = "",
  billingAdress = "Same as Shipping",
  shippingAdress = "",
  orderDate = "",
  orderNumber = "",
  purchaseOrder = "",
  customerContact = "",
  postComment = "",
  watermark = "",
  userName = "",
  userPhone = "",
  userEmail = "",
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
  const partsList = parts.map((part) => ({
    text: part.partNumber || "",
    description: part.description || "",
    orderQty: part.quantity || 0,
    shipQty: part.quantityShipped || 0,
  }));

  function countQuantities(
    partsList: {
      text: string;
      description: string;
      orderQty: number;
      shipQty: number;
    }[]
  ) {
    let totalOrderQty = 0;
    let totalShipQty = 0;
    for (const part of partsList) {
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
    red: "#ff0000",
    green: "#00ff00",
  };
  const textBlue = colors.puertoRico;
  const backgroundBlue = colors.rhino;
  const backgroundGrey = colors.osloGray;
  const falseBorder = [false, false, false, false];
  const trueBorder = [true, true, true, true];
  const emptyCol = { text: "", border: falseBorder };
  const emptyRow = [emptyCol, emptyCol, emptyCol, emptyCol];

  const body = [
    [
      {
        text: "ITEM #",
        fillColor: backgroundBlue,
        color: "white",
        border: falseBorder,
      },
      {
        text: "DESCRIPTION",
        fillColor: backgroundBlue,
        alignment: "center",
        color: "white",
        border: falseBorder,
      },
      {
        text: "ORDER QTY",
        fillColor: backgroundBlue,
        color: "white",
        border: falseBorder,
      },
      {
        text: "SHIP QTY",
        fillColor: backgroundBlue,
        color: "white",
        border: falseBorder,
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
        border: falseBorder,
      },
      {
        text: "Total:",
        alignment: "right",
        border: falseBorder,
      },
      { text: totalOrderQty, border: falseBorder },
      { text: totalShipQty, border: falseBorder },
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
                text: "PURCHASE ORDER",
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
              { text: "60 Ottawa St S", border: falseBorder },
              emptyCol,
              { text: "Date:", border: falseBorder },
              { text: formattedDate, border: trueBorder },
            ],
            [
              {
                text: "Kitchener, ON, N2G 3R5",
                border: falseBorder,
              },
              { text: "", border: falseBorder },
              { text: "LIA Job #:", border: falseBorder },
              { text: customer, border: trueBorder }, //replace customer
            ],
            [
              {
                text: "Phone: 519-590-7769 519-504-7906",
                border: falseBorder,
              },
              emptyCol,
              {
                text: "P.O. NO.",
                bold: true,
                border: falseBorder,
              },
              { text: "", bold: true, border: trueBorder }, //Replace empty string with PO#
            ],
            [
              {
                text: "Website: www.linesideautomation.com",
                border: falseBorder,
              },
              emptyCol,
              emptyCol,
              emptyCol,
            ],
          ],
        },
      },
      //   Header End
      {
        margin: [-5, 10, -5, 10],
        table: {
          headerRows: 1,
          widths: ["auto", "*", "auto", "*"],
          body: [
            [
              {
                text: "VENDOR:",
                fillColor: backgroundBlue,
                color: "white",
                border: falseBorder,
              },
              emptyCol,
              {
                text: "SHIP TO:",
                fillColor: backgroundBlue,
                color: "white",
                border: falseBorder,
              },
              emptyCol,
            ],
            [
              {
                text: "Aztec Electrical Supply", //Replace
                border: falseBorder,
              },
              emptyCol,
              {
                text: shippingAdress, //Change to shippinInstructions
                border: falseBorder,
              },
              emptyCol,
            ],
            [
              {
                text: "75 Saltsman", //Replace
                border: falseBorder,
              },
              emptyCol,
              emptyCol,
              emptyCol,
            ],
            [
              {
                text: "Cambridge ON, N3H 4R7", //Replace
                border: falseBorder,
              },
              emptyCol,
              emptyCol,
              emptyCol,
            ],
            [
              {
                text: "(519)...", //Replace
                border: falseBorder,
              },
              emptyCol,
              emptyCol,
              emptyCol,
            ],
            [
              {
                text: "(519)...", //Replace
                border: falseBorder,
              },
              emptyCol,
              emptyCol,
              emptyCol,
            ],
            [
              {
                text: "jschnarr@", //Replace
                border: falseBorder,
              },
              emptyCol,
              emptyCol,
              emptyCol,
            ],

            // [
            //   { text: billingAdress, border: falseBorder },
            //   emptyCol,
            //   { text: shippingAdress, border: falseBorder },
            //   emptyCol,
            // ],
          ],
        },
      },

      //////////Left off here
      {
        margin: [-5, 0, -5, 0],
        table: {
          headerRows: 1,
          widths: ["auto", "*", "auto", "*"],
          body: [
            [
              {
                text: "ORDER DATE",
                fillColor: backgroundBlue,
                color: "white",
                border: falseBorder,
              },
              {
                text: "ORDER #",
                fillColor: backgroundBlue,
                color: "white",
                border: falseBorder,
              },
              {
                text: "PO #",
                fillColor: backgroundBlue,
                color: "white",
                border: falseBorder,
              },
              {
                text: "CUSTOMER CONTACT",
                fillColor: backgroundBlue,
                color: "white",
                border: falseBorder,
              },
            ],
            emptyRow,
            [
              { text: orderDate, border: falseBorder },
              { text: orderNumber, border: falseBorder },
              { text: purchaseOrder, border: falseBorder },
              { text: customerContact, border: falseBorder },
            ],
            emptyRow,
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
      {
        text: "If you have any questions or concers, please contact\n",
        alignment: "center",
      },
      {
        text: "[" + userName + ", " + userPhone + ", " + userEmail + "]",
        alignment: "center",
      },
      {
        text: "Thank You For Your Business!",
        alignment: "center",
        italics: true,
        bold: true,
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
