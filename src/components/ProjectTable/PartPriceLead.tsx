import { NumberInput, Text } from "@mantine/core";
import { ManufacturerPart, ProjectPart } from "@prisma/client";
import { useState } from "react";
import { api } from "../../utils/api";

export default function PartPriceLead({
  part,
}: {
  part?: ProjectPart & {
    manufacturerPart: {
      partNumber: string;
    };
  };
}) {
  if (!part?.id) return <></>;

  const { data: history } = api.parts.getMostRecentPriceLeadHistory.useQuery(
    part.manufacturerPartId
  );

  if (!history) return <></>;

  if (!history[0]?.VendorPart[0]?.VendorPartPriceLeadHistory[0])
    return <Text>No price history</Text>;

  let leadTime = 0;
  let price = 0;
  let stock = 0;
  let latestStartDate = new Date("1900-01-01");
  let vendor = "";

  history[0]?.VendorPart.forEach((vendorPart) => {
    vendorPart.VendorPartPriceLeadHistory.forEach((priceHistory) => {
      const startDate = new Date(priceHistory.startDate);
      if (startDate > latestStartDate) {
        vendor = vendorPart.Vendor.name;
        latestStartDate = startDate;
        leadTime = priceHistory.leadTime;
        price = priceHistory.price;
        stock = priceHistory.stock;
      }
    });
  });

  console.log(history);
  return (
    <>
      <div className="flex flex-row gap-x-1">
        <Text className="w-24">{vendor}</Text>
        <Text className="w-24">{`$${price}`}</Text>
        <Text className="w-24">{`${leadTime} days`}</Text>
        <Text className="w-24">{stock}</Text>
        <Text className="w-24">{latestStartDate.toLocaleDateString()}</Text>
      </div>
    </>
  );
}
