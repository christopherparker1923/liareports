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

  if (!history) return <Text>No part history</Text>;

  let leadTime = 0;
  let price = 0;
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
      }
    });
  });

  console.log(history);
  return (
    <>
      <div className="flex flex-row gap-x-1">
        <Text>
          {vendor} {price} {leadTime} {latestStartDate.toDateString()}
        </Text>
      </div>
    </>
  );
}
