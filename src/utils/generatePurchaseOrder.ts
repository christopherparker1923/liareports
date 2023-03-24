// Import the pdfmake library
import { Vendor } from "@prisma/client";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import type { TDocumentDefinitions } from "pdfmake/interfaces";
import type { PackingSlipPart } from "../pages/dashboard/generate/packing-slip";
pdfMake.vfs = pdfFonts.pdfMake.vfs;
pdfMake.fonts = {
  MrsSaintDelafield: {
    normal: `${window.location.origin}/fonts/MrsSaintDelafield-Regular.ttf`,
  },
  Roboto: {
    normal: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Regular.ttf',
    bold: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Medium.ttf',
    italics: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Italic.ttf',
    bolditalics: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-MediumItalic.ttf'
  },
};
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
  const emptyRowOfFour = [emptyCol, emptyCol, emptyCol, emptyCol];
  const emptyRowOfThree = [emptyCol, emptyCol, emptyCol];

  const body = [
    [
      {
        text: "QTY",
        fillColor: backgroundBlue,
        color: "white",
        border: falseBorder,
      },
      {
        text: "UNIT",
        fillColor: backgroundBlue,
        color: "white",
        border: falseBorder,
      },
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
        text: "MANUFACTURER",
        fillColor: backgroundBlue,
        color: "white",
        border: falseBorder,
      },
      {
        text: "UNIT PRICE",
        fillColor: backgroundBlue,
        color: "white",
        border: falseBorder,
      },
      {
        text: "LINE TOTAL",
        fillColor: backgroundBlue,
        color: "white",
        border: falseBorder,
      },
    ],
    ...partsList.map((part) => [
      {
        text: part.text, //UPDATE THIS WHOLE SECTION
      },
      {
        text: part.text,
      },
      {
        text: part.text,
      },
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
      emptyCol,
      emptyCol,
      emptyCol,
      emptyCol,
      emptyCol,
      {
        text: "SUBTOTAL:",
        alignment: "right",
        border: falseBorder,
      },
      { text: "$" + "test", border: falseBorder },
    ],
    [
      emptyCol,
      emptyCol,
      emptyCol,
      emptyCol,
      emptyCol,
      {
        text: "HST:",
        alignment: "right",
        border: falseBorder,
      },
      { text: "$" + "test", border: falseBorder },
    ],
    [
      emptyCol,
      emptyCol,
      emptyCol,
      emptyCol,
      emptyCol,
      {
        text: "TOTAL:",
        alignment: "right",
        border: falseBorder,
      },
      { text: "$" + "test", border: falseBorder },
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
            margin: [0, -10, 100, 0],
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
              { text: "Replace PO", bold: true, border: trueBorder }, //Replace empty string with PO#
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
          widths: ["35%", "*", "25%"],
          body: [
            [
              {
                text: "SHIPPING METHOD",
                fillColor: backgroundBlue,
                color: "white",
                border: falseBorder,
              },
              {
                text: "SHIPPING TERMS",
                fillColor: backgroundBlue,
                color: "white",
                border: falseBorder,
              },
              {
                text: "DELIVERY DATE",
                fillColor: backgroundBlue,
                color: "white",
                border: falseBorder,
              },
            ],

            [
              { text: orderDate, border: falseBorder }, //UPDATE
              { text: orderNumber, border: falseBorder }, //UPDATE
              { text: purchaseOrder, border: falseBorder }, //UPDATE
            ],
          ],
        },
      },
      {
        margin: [-5, 10, -5, 10],
        table: {
          headerRows: 1,
          widths: ["auto", "auto", "*", "auto", "auto", "auto", "auto"],
          body,
        },
      },

      {
        margin: [-5, -20, -5, 0],
        table: {
          widths: ["*", "25%", "auto"],
          heights: ["auto", 60, "auto"],
          body: [
            [
              {
                text: "COMMENTS:",
                fillColor: backgroundGrey,
                border: [true, true, true, false],
              },
              emptyCol,
              emptyCol,
            ],
            [
              {
                text: postComment,
                border: [true, false, true, true],
              },
              {
                text: "Mike Badus",
                margin: [5, 52, 0, 0],
                font: "MrsSaintDelafield",
                border: [false, false, false, true],
              },
              {
                text: formattedDate,
                margin: [0, 52, 0, 0],
                border: [false, false, false, true],
              },
            ],
            [
              emptyCol,
              {
                text: "Authorized by",
                border: falseBorder,
              },
              {
                text: "Date",
                border: falseBorder,
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
