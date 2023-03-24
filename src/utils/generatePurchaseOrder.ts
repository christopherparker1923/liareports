// Import the pdfmake library
import { Vendor } from "@prisma/client";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import type { TDocumentDefinitions } from "pdfmake/interfaces";
import { StringValidation } from "zod";
import type {
  PurchaseOrderPart,
  VendorAutocompleteItem,
} from "../pages/dashboard/generate/purchase-order";
pdfMake.vfs = pdfFonts.pdfMake.vfs;
pdfMake.fonts = {
  MrsSaintDelafield: {
    normal: `${window.location.origin}/fonts/MrsSaintDelafield-Regular.ttf`,
  },
  Roboto: {
    normal:
      "https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Regular.ttf",
    bold: "https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Medium.ttf",
    italics:
      "https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Italic.ttf",
    bolditalics:
      "https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-MediumItalic.ttf",
  },
};

type purchaseOrderInputs = {
  parts: PurchaseOrderPart[];
  vendor: VendorAutocompleteItem;
  orderDate: string;
  purchaseOrder: string;
  postComment: string;
  shipTo: string;
  shippingMethod: string;
  shippingTerms: string;
  deliveryDate: string;
  jobNumber: string;
  // total: number;
  // hst: number;
  // subTotal: number;
  authorizedBy: string;
  watermark: string;
  watermarkColor: string;
};

function formatMoney(number: number | string): string {
  if (typeof number === "string") {
    number = parseFloat(number);
  }
  if (isNaN(number)) {
    return "Invalid input";
  }
  // Convert the number to a string with exactly two decimal places
  const formattedNumber = number.toFixed(2);

  // Split the string into the integer and decimal parts
  const parts = formattedNumber.split(".");
  const integerPart = parts[0] || "0"; // Use "0" as the default value if integerPart is undefined
  const decimalPart = parts[1];

  // Add commas every three digits before the decimal point
  let integerPartWithCommas = "";
  for (let i = integerPart.length - 1, j = 0; i >= 0; i--, j++) {
    if (j % 3 === 0 && j !== 0) {
      integerPartWithCommas = "," + integerPartWithCommas;
    }
    integerPartWithCommas = integerPart[i] + integerPartWithCommas;
  }

  // Add the dollar sign and combine the integer and decimal parts
  const result = "$" + integerPartWithCommas + "." + decimalPart;

  return result;
}

// Define the PDF document structure
export async function generatePurchaseOrder(inputs: purchaseOrderInputs) {
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
  const partsList = inputs.parts.map((part) => ({
    quantity: part.quantity || 0,
    unit: part.unit || "",
    partNumber: part.partNumber || "",
    description: part.description || "",
    manufacturerName: part.manufacturerName || "",
    unitPrice: part.unitPrice || 0,
    lineTotal: part.quantity * part.unitPrice || 0,
  }));

  const subtotal = partsList.reduce((acc, part) => acc + part.lineTotal, 0);
  const HST = subtotal * 0.13;
  const total = subtotal + HST;

  // function countQuantities(
  //   partsList: {
  //     text: string;
  //     description: string;
  //     orderQty: number;
  //     shipQty: number;
  //   }[]
  // ) {
  //   let totalOrderQty = 0;
  //   let totalShipQty = 0;
  //   for (const part of partsList) {
  //     totalOrderQty += part.orderQty;
  //     totalShipQty += part.shipQty;
  //   }
  //   return { totalOrderQty, totalShipQty };
  // }

  //const { totalOrderQty, totalShipQty } = countQuantities(partsList);

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
        alignment: "center",
        color: "white",
        border: falseBorder,
      },
      {
        text: "UNIT",
        fillColor: backgroundBlue,
        alignment: "center",
        color: "white",
        border: falseBorder,
      },
      {
        text: "ITEM #",
        fillColor: backgroundBlue,
        alignment: "center",
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
        alignment: "center",
        color: "white",
        border: falseBorder,
      },
      {
        text: "PRICE",
        fillColor: backgroundBlue,
        alignment: "center",
        color: "white",
        border: falseBorder,
      },
      {
        text: "TOTAL",
        fillColor: backgroundBlue,
        alignment: "center",
        color: "white",
        border: falseBorder,
      },
    ],
    ...partsList.map((part) => [
      {
        text: part.quantity, //UPDATE THIS WHOLE SECTION
        alignment: "center",
        fontSize: "10",
      },
      {
        text: part.unit,
        alignment: "center",
        fontSize: "10",
      },
      {
        text: part.partNumber,
        alignment: "center",
        fontSize: "10",
      },
      {
        text: part.description,
        alignment: "center",
        fontSize: "10",
      },
      {
        text: part.manufacturerName,
        alignment: "center",
        fontSize: "10",
      },
      {
        text: formatMoney(part.unitPrice),
        alignment: "center",
        fontSize: "10",
      },
      {
        text: formatMoney(part.lineTotal),
        alignment: "center",
        fontSize: "10",
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
      { text: formatMoney(subtotal), border: falseBorder },
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
      { text: formatMoney(HST), border: falseBorder },
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
      { text: formatMoney(total), border: falseBorder },
    ],
  ];

  const docDef: TDocumentDefinitions = {
    watermark: {
      text: inputs.watermark,
      fontSize: 40,
      angle: -45,
      color: inputs.watermarkColor,
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
              { text: inputs.jobNumber, border: trueBorder }, //replace customer
            ],
            [
              {
                text: "Phone: (519) 590-7769, (519) 504-7906",
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
                text: inputs.vendor.name,
                border: falseBorder,
              },
              emptyCol,
              {
                text: inputs.shipTo,
                border: falseBorder,
              },
              emptyCol,
            ],
            [
              {
                text: inputs.vendor.addressNo + " " + inputs.vendor.streetName,
                border: falseBorder,
              },
              emptyCol,
              emptyCol,
              emptyCol,
            ],
            [
              {
                text:
                  inputs.vendor.city +
                  " " +
                  inputs.vendor.province +
                  ", " +
                  inputs.vendor.postalCode,
                border: falseBorder,
              },
              emptyCol,
              emptyCol,
              emptyCol,
            ],
            [
              {
                text: inputs.vendor.phoneContact,
                border: falseBorder,
              },
              emptyCol,
              emptyCol,
              emptyCol,
            ],
            [
              {
                text: inputs.vendor.faxContact,
                border: falseBorder,
              },
              emptyCol,
              emptyCol,
              emptyCol,
            ],
            [
              {
                text: inputs.vendor.emailContact,
                border: falseBorder,
              },
              emptyCol,
              emptyCol,
              emptyCol,
            ],
          ],
        },
      },
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
                alignment: "center",
              },
              {
                text: "SHIPPING TERMS",
                fillColor: backgroundBlue,
                color: "white",
                border: falseBorder,
                alignment: "center",
              },
              {
                text: "DELIVERY DATE",
                fillColor: backgroundBlue,
                color: "white",
                border: falseBorder,
                alignment: "center",
              },
            ],

            [
              {
                text: inputs.shippingMethod,
                alignment: "center",
                border: falseBorder,
              },
              {
                text: inputs.shippingTerms,
                alignment: "center",
                border: falseBorder,
              },
              {
                text: inputs.deliveryDate,
                alignment: "center",
                border: falseBorder,
              },
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
                text: inputs.postComment,
                border: [true, false, true, true],
              },
              {
                text: inputs.authorizedBy,
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
